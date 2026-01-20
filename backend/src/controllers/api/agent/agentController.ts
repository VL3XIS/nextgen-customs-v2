console.log('Controller: Loading imports...');
import { Request, Response } from 'express';
import prisma from '../../../config/database';
console.log('Controller: Importing Resend...');
import { Resend } from 'resend';

console.log('Controller: Initializing Resend...');
const resend = new Resend(process.env.RESEND_API_KEY);
console.log('Controller: Resend Initialized.');

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------
const generateTimeSlots = (dateStr: string, durationMinutes: number = 30) => {
    const slots = [];
    const startHour = 9;  // 9 AM
    const endHour = 17;   // 5 PM
    let currentTime = new Date(`${dateStr}T09:00:00`);
    const endTime = new Date(`${dateStr}T17:00:00`);

    while (currentTime < endTime) {
        slots.push({
            time: currentTime.toTimeString().slice(0, 5),
            display: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        });
        currentTime = new Date(currentTime.getTime() + durationMinutes * 60000);
    }
    return slots;
};

// ------------------------------------------------------------------
// 1. CHECK AVAILABILITY (Real DB Check)
// ------------------------------------------------------------------
export const checkAvailability = async (req: Request, res: Response) => {
    try {
        const { date, appointment_type } = req.body;
        console.log('Agent: Check Availability', { date });

        if (!date) return res.json({ available_slots: [] });

        const duration = appointment_type === 'drop_off' ? 30 : 15;
        const allSlots = generateTimeSlots(date, duration);

        // Fetch Real Appointments from DB
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const existingAppts = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: { not: 'CANCELLED' }
            }
        });

        // Basic conflict detection
        const bookedTimes = existingAppts.map(a => {
            const d = new Date(a.date);
            return d.toTimeString().slice(0, 5); // "HH:MM"
        });

        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot.time));

        return res.json({
            success: true,
            available_slots: availableSlots.map(s => ({
                date,
                time: s.time,
                type: appointment_type,
                estimator: { name: "Mike", speaks_spanish: true }
            }))
        });
    } catch (error) {
        console.error('Check Availability Error:', error);
        return res.status(500).json({ success: false, message: "Error checking availability" });
    }
};

// ------------------------------------------------------------------
// 2. BOOK APPOINTMENT (Real DB + Email)
// ------------------------------------------------------------------
import * as fs from 'fs';
import * as path from 'path';

// ... imports

export const bookAppointment = async (req: Request, res: Response) => {
    try {
        console.log('Agent: Book Appointment Payload:', req.body);
        const {
            customer_name,
            customer_phone,
            customer_email,
            scheduled_date,
            scheduled_time,
            appointment_type,
            // ALIASES FOR ROBUSTNESS
            date,
            time,
            name,
            phone,
            email,
            // FLATTENED PARAMS SUPPORT
            vehicle_year,
            vehicle_make,
            vehicle_model,
            // Legacy support
            vehicle_info,
            special_notes
        } = req.body;

        const safeDate = scheduled_date || date;
        const safeTime = scheduled_time || time;
        const safeName = customer_name || name || 'Voice Customer';
        const safePhone = customer_phone || phone || 'Not Provided';
        const safeEmail = customer_email || email || 'alexisruiz1040@gmail.com';

        console.log("Agent Booking Payload (Processed):", { safeDate, safeTime, safeName });

        // 1. Validate Required Fields (Prevent Crash)
        if (!safeDate || !safeTime) {
            console.error("Missing Date/Time", { safeDate, safeTime });
            return res.json({ success: false, message: "Missing Date or Time. Please ask the customer again." });
        }

        // 2. PARSE DATE (Robust)
        let isoDateStr = safeDate;
        if (!safeDate.includes('-')) {
            // Handle "January 21, 2026" or "tomorrow"
            const d = new Date(safeDate);
            if (!isNaN(d.getTime())) {
                isoDateStr = d.toISOString().split('T')[0];
            }
        }

        // Year Correction
        if (isoDateStr.startsWith('2024') || isoDateStr.startsWith('2025')) {
            isoDateStr = isoDateStr.replace(/^202[0-5]/, '2026');
        }

        // 3. PARSE TIME (Handle AM/PM)
        let timeStr = String(safeTime).toLowerCase().replace(/\s/g, ''); // "10:00pm"
        let [hours, minutes] = timeStr.replace(/am|pm/, '').split(':').map(Number);

        if (timeStr.includes('pm') && hours < 12) hours += 12;
        if (timeStr.includes('am') && hours === 12) hours = 0;
        if (isNaN(minutes)) minutes = 0;
        if (isNaN(hours)) hours = 9; // Default to 9am if garbage received

        const validTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // "14:00"
        const isoDateTime = new Date(`${isoDateStr}T${validTime}:00`);

        if (isNaN(isoDateTime.getTime())) {
            console.error("Invalid Date Constructed:", `${isoDateStr}T${validTime}:00`);
            return res.json({
                success: false,
                message: "I verified the date, but it seems invalid. Could you repeat the time?"
            });
        }
        // -----------------------------

        // --- SAFETY DEFAULTS ---
        const safeType = appointment_type || 'consultation';

        let safeVehicle = 'Unknown Vehicle';
        if (vehicle_model) {
            safeVehicle = `${vehicle_year || ''} ${vehicle_make || ''} ${vehicle_model}`.trim();
        } else if (vehicle_info?.model) {
            safeVehicle = `${vehicle_info.year || ''} ${vehicle_info.make || ''} ${vehicle_info.model}`.trim();
        }
        // -----------------------

        // 1. Save to Database
        console.log("Agent: Creating DB Record...", { isoDateTime, safeType, safeVehicle });

        const newAppt = await prisma.appointment.create({
            data: {
                customerName: safeName,
                customerPhone: safePhone,
                customerEmail: safeEmail,
                date: isoDateTime,
                appointmentType: safeType,
                vehicleModel: safeVehicle,
                notes: special_notes || 'Booked via Voice Agent',
                status: 'CONFIRMED'
            }
        });

        // 2. Send Confirmation Email (Real)
        let emailStatus = 'skipped';
        const apiKey = process.env.RESEND_API_KEY;

        if (apiKey) {
            try {
                console.log('Book Appt: Attempting to send email via Resend...');
                await resend.emails.send({
                    from: 'NextGen Customs <onboarding@resend.dev>',
                    to: ['alexisruiz1040@gmail.com'], // Demo override
                    subject: `Appointment Confirmed: ${safeDate} @ ${safeTime}`,
                    html: `
                        <h1>Appointment Confirmed</h1>
                        <p>Hi ${safeName},</p>
                        <p>You are booked for a <strong>${safeType}</strong> on <strong>${safeDate} at ${safeTime}</strong>.</p>
                        <p>Thank you for choosing NextGen Customs!</p>
                    `
                });
                console.log('Book Appt: Email Sent Successfully!');
                emailStatus = 'sent';
            } catch (emailErr) {
                console.error("Book Appt: Email Failed:", emailErr);
                emailStatus = 'failed';
            }
        }

        return res.json({
            success: true,
            message: `Appointment confirmed for ${isoDateStr} at ${validTime}!`,
            appointment_id: newAppt.id,
            email_status: emailStatus
        });

    } catch (error) {
        console.error('Book Appointment Error:', error);
        return res.status(500).json({ success: false, message: "Error booking appointment" });
    }
};

// ------------------------------------------------------------------
// 3. CHECK VEHICLE STATUS (Reference Real Jobs)
// ------------------------------------------------------------------
export const checkVehicleStatus = async (req: Request, res: Response) => {
    try {
        const { vehicle, customerName } = req.body;
        console.log('Agent: Status Check', { vehicle, customerName });

        const whereClause: any = {};
        if (vehicle) whereClause.vehicle = { contains: vehicle, mode: 'insensitive' };
        if (customerName) whereClause.customerName = { contains: customerName, mode: 'insensitive' };

        const jobs = await prisma.job.findMany({
            where: whereClause,
            take: 1,
            orderBy: { updatedAt: 'desc' }
        });

        if (jobs.length === 0) {
            return res.json({
                success: true,
                found: false,
                message: "I couldn't find a record for that vehicle in our active system."
            });
        }

        const job = jobs[0];
        return res.json({
            success: true,
            found: true,
            message: `Found it. The ${job.vehicle} is currently ${job.status}.`
        });

    } catch (error) {
        console.error('Status Error:', error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

// ------------------------------------------------------------------
// 4. LIST ACTIVE JOBS (Real DB)
// ------------------------------------------------------------------
export const listActiveJobs = async (req: Request, res: Response) => {
    try {
        console.log('Agent: List Active Jobs');
        const jobs = await prisma.job.findMany({
            where: { status: { not: 'COMPLETE' } }
        });

        return res.json({
            success: true,
            jobs: jobs,
            message: `We have ${jobs.length} active jobs right now.`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error listing jobs" });
    }
};

// ------------------------------------------------------------------
// 5. GENERATE REPORT (For High Value Clients)
// ------------------------------------------------------------------
export const generateReport = async (req: Request, res: Response) => {
    try {
        const { report_type } = req.body;

        if (report_type === 'financial') {
            // Find top spender
            const jobs = await prisma.job.findMany({ where: { status: 'COMPLETE' } });
            // Simple aggregator
            const totals: Record<string, number> = {};
            jobs.forEach(j => {
                const val = j.estimatedValue || 0;
                totals[j.customerName] = (totals[j.customerName] || 0) + val;
            });

            const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
            const topClient = sorted[0] ? `${sorted[0][0]} ($${sorted[0][1]})` : "None";

            return res.json({
                success: true,
                content: `Financial Report: Top Client is ${topClient}. Total Revenue Verified.`
            });
        }

        return res.json({ success: true, content: "Standard Report Generated." });

    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// ------------------------------------------------------------------
// 6. RESCHEDULE APPOINTMENT
// ------------------------------------------------------------------
export const rescheduleAppointment = async (req: Request, res: Response) => {
    try {
        const { appointment_id, new_date, new_time } = req.body;
        console.log('Agent: Reschedule Appointment', req.body);

        const isoDateTime = new Date(`${new_date}T${new_time}:00`);

        const updatedAppt = await prisma.appointment.update({
            where: { id: appointment_id },
            data: {
                date: isoDateTime,
                status: 'CONFIRMED' // Reset status if it was effectively "rescheduled"
            }
        });

        // Notify via email (optional but nice)
        if (process.env.RESEND_API_KEY && updatedAppt.customerEmail) {
            await resend.emails.send({
                from: 'NextGen Customs <onboarding@resend.dev>',
                to: ['alexisruiz1040@gmail.com'], // Demo override
                subject: `Appointment Rescheduled: ${new_date} @ ${new_time}`,
                html: `
                    <h1>Appointment Updated</h1>
                    <p>Hi ${updatedAppt.customerName},</p>
                    <p>Your appointment has been moved to <strong>${new_date} at ${new_time}</strong>.</p>
                `
            });
        }

        return res.json({
            success: true,
            message: `Appointment rescheduled to ${new_date} at ${new_time}.`
        });

    } catch (error) {
        console.error('Reschedule Error:', error);
        return res.status(500).json({ success: false, message: "Error rescheduling appointment." });
    }
};

// ------------------------------------------------------------------
// 7. CANCEL APPOINTMENT
// ------------------------------------------------------------------
export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const { appointment_id, cancellation_reason } = req.body;
        console.log('Agent: Cancel Appointment', req.body);

        await prisma.appointment.update({
            where: { id: appointment_id },
            data: {
                status: 'CANCELLED',
                notes: cancellation_reason ? `Cancelled: ${cancellation_reason}` : 'Cancelled by user'
            }
        });

        return res.json({
            success: true,
            message: "Appointment cancelled successfully."
        });

    } catch (error) {
        console.error('Cancel Error:', error);
        return res.status(500).json({ success: false, message: "Error cancelling appointment." });
    }
};

// ------------------------------------------------------------------
// 8. SEARCH CUSTOMER HISTORY
// ------------------------------------------------------------------
export const searchCustomerHistory = async (req: Request, res: Response) => {
    try {
        const { customer_identifier } = req.body;
        console.log('Agent: Search History', customer_identifier);

        if (!customer_identifier) {
            return res.status(400).json({ success: false, message: "Customer identifier required." });
        }

        // Search Jobs
        const jobs = await prisma.job.findMany({
            where: {
                customerName: { contains: customer_identifier, mode: 'insensitive' }
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        // Search Appointments
        const appointments = await prisma.appointment.findMany({
            where: {
                customerName: { contains: customer_identifier, mode: 'insensitive' }
            },
            take: 5,
            orderBy: { date: 'desc' }
        });

        return res.json({
            success: true,
            data: {
                jobs: jobs.map(j => ({ id: j.id, vehicle: j.vehicle, status: j.status, value: j.estimatedValue })),
                appointments: appointments.map(a => ({ id: a.id, date: a.date, type: a.appointmentType, status: a.status }))
            },
            message: `Found ${jobs.length} jobs and ${appointments.length} appointments for ${customer_identifier}.`
        });

    } catch (error) {
        console.error('History Error:', error);
        return res.status(500).json({ success: false, message: "Error searching history." });
    }
};

// ------------------------------------------------------------------
// 9. ANALYZE REVENUE
// ------------------------------------------------------------------
export const analyzeRevenue = async (req: Request, res: Response) => {
    try {
        const { time_period } = req.body;
        console.log('Agent: Analyze Revenue', time_period);

        let dateFilter = new Date();
        const now = new Date();

        switch (time_period) {
            case 'today':
                dateFilter.setHours(0, 0, 0, 0);
                break;
            case 'week':
                dateFilter.setDate(now.getDate() - 7);
                break;
            case 'month':
                dateFilter.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                dateFilter.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                dateFilter.setFullYear(now.getFullYear() - 1);
                break;
            default:
                dateFilter.setMonth(now.getMonth() - 1); // Default to month
        }

        const jobs = await prisma.job.findMany({
            where: {
                createdAt: { gte: dateFilter }
            }
        });

        let totalRevenue = 0;
        let pipelineRevenue = 0;
        let completedJobs = 0;
        let activeJobs = 0;

        jobs.forEach(job => {
            const val = job.estimatedValue || 0;
            if (job.status === 'COMPLETE') {
                totalRevenue += val;
                completedJobs++;
            } else {
                pipelineRevenue += val;
                activeJobs++;
            }
        });

        return res.json({
            success: true,
            revenue: {
                total_collected: totalRevenue,
                pipeline: pipelineRevenue,
                completed_count: completedJobs,
                active_count: activeJobs,
                currency: "USD"
            },
            message: `Since ${time_period} start (${dateFilter.toLocaleDateString()}), we have completed ${completedJobs} jobs worth $${totalRevenue}. Pipeline has ${activeJobs} jobs worth $${pipelineRevenue}.`
        });

    } catch (error) {
        console.error('Revenue Error:', error);
        return res.status(500).json({ success: false, message: "Error analyzing revenue." });
    }
};

