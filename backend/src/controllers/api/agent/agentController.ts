import { Request, Response } from 'express';
import prisma from '../../../config/database';

// ------------------------------------------------------------------
// HELPER: Generate Mock Time Slots (9 AM - 5 PM)
// ------------------------------------------------------------------
const generateTimeSlots = (dateStr: string, durationMinutes: number = 30) => {
    const slots = [];
    const startHour = 9;
    const endHour = 17; // 5 PM

    let currentTime = new Date(`${dateStr}T09:00:00`);
    const endTime = new Date(`${dateStr}T17:00:00`);

    while (currentTime < endTime) {
        slots.push({
            time: currentTime.toTimeString().slice(0, 5), // "09:00"
            display: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        });
        currentTime = new Date(currentTime.getTime() + durationMinutes * 60000);
    }
    return slots;
};

// ------------------------------------------------------------------
// 1. CHECK AVAILABILITY
// ------------------------------------------------------------------
export const checkAvailability = async (req: Request, res: Response) => {
    try {
        const { date, appointment_type } = req.body; // date: "2026-01-21"
        console.log('Agent: Check Availability', { date, appointment_type });

        if (!date) {
            return res.json({ available_slots: [] });
        }

        // Generate all potential slots for the day
        const duration = appointment_type === 'drop_off' ? 30 : 15;
        const allSlots = generateTimeSlots(date, duration);

        // Fetch existing appointments for that day to find conflicts
        // In a real app, strict date parsing is needed. 
        // For MVP, we just check if any appointment starts at that time string on that date.
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const conflicts = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        // Simple conflict resolution: If an appointment exists roughly at that time, remove slot
        // This is a naive check (exact string match on HH:mm converted to Date ISO) for the demo
        const availableSlots = allSlots.filter(slot => {
            // Check if any conflict matching the hour
            const slotHour = parseInt(slot.time.split(':')[0]);
            return !conflicts.some(c => {
                const conflictHour = new Date(c.date).getHours();
                return conflictHour === slotHour;
            });
        });

        return res.json({
            success: true,
            available_slots: availableSlots.map(s => ({
                date,
                time: s.time,
                type: appointment_type,
                estimator: { name: "Mike", speaks_spanish: true } // Hardcoded for demo persona
            }))
        });

    } catch (error) {
        console.error('Check Availability Error:', error);
        return res.status(500).json({ success: false, message: "Error checking availability" });
    }
};

// ------------------------------------------------------------------
// 2. BOOK APPOINTMENT
// ------------------------------------------------------------------
export const bookAppointment = async (req: Request, res: Response) => {
    try {
        console.log('Agent: Book Appointment', req.body);
        const {
            customer_name,
            customer_phone,
            customer_email,
            preferred_language,
            scheduled_date, // "2026-01-21"
            scheduled_time, // "09:00"
            vehicle_info,
            appointment_type,
            special_notes
        } = req.body;

        // Find default user (shop owner)
        const defaultUser = await prisma.user.findFirst();

        // Construct Date object
        // Combine date and time
        const isoDateTime = new Date(`${scheduled_date}T${scheduled_time}:00`);

        const newAppt = await prisma.appointment.create({
            data: {
                userId: defaultUser?.id,
                customerName: customer_name,
                customerPhone: customer_phone,
                customerEmail: customer_email,
                language: preferred_language || 'en',
                date: isoDateTime,
                appointmentType: appointment_type || 'general',
                vehicleYear: vehicle_info?.year,
                vehicleMake: vehicle_info?.make,
                vehicleModel: vehicle_info?.model,
                vehicleColor: vehicle_info?.color,
                vehicleVin: vehicle_info?.vin,
                notes: special_notes,
                status: 'CONFIRMED'
            }
        });

        return res.json({
            success: true,
            message: preferred_language === 'es' ? '¡Cita confirmada!' : 'Appointment confirmed!',
            appointment_id: newAppt.id,
            details: newAppt
        });

    } catch (error) {
        console.error('Book Appointment Error:', error);
        return res.status(500).json({ success: false, message: "Error booking appointment" });
    }
};

// ------------------------------------------------------------------
// 3. RESCHEDULE APPOINTMENT
// ------------------------------------------------------------------
export const rescheduleAppointment = async (req: Request, res: Response) => {
    try {
        console.log('Agent: Reschedule', req.body);
        const { appointment_id, new_date, new_time } = req.body;

        const isoDateTime = new Date(`${new_date}T${new_time}:00`);

        const updated = await prisma.appointment.update({
            where: { id: appointment_id },
            data: {
                date: isoDateTime,
                status: 'CONFIRMED'
            }
        });

        return res.json({
            success: true,
            message: 'Appointment rescheduled successfully',
            appointment: updated
        });

    } catch (error) {
        console.error('Reschedule Error:', error);
        return res.status(500).json({ success: false, message: "Error rescheduling" });
    }
};

// ------------------------------------------------------------------
// 4. CANCEL APPOINTMENT
// ------------------------------------------------------------------
export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        console.log('Agent: Cancel', req.body);
        const { appointment_id, cancellation_reason } = req.body;

        const updated = await prisma.appointment.update({
            where: { id: appointment_id },
            data: {
                status: 'CANCELLED',
                notes: `Cancelled: ${cancellation_reason}`
            }
        });

        return res.json({
            success: true,
            message: 'Appointment cancelled'
        });

    } catch (error) {
        console.error('Cancel Error:', error);
        return res.status(500).json({ success: false, message: "Error cancelling appointment" });
    }
};

// ------------------------------------------------------------------
// 5. CHECK VEHICLE STATUS (Legacy Support)
// ------------------------------------------------------------------
export const checkVehicleStatus = async (req: Request, res: Response) => {
    try {
        const { vehicle, customerName } = req.body;
        console.log('Agent: Status Check', { vehicle, customerName });

        if (!vehicle && !customerName) {
            return res.status(400).json({ success: false, message: "Provide vehicle or name." });
        }

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
                message: "Vehicle not found in active records."
            });
        }

        const job = jobs[0];
        // Clean status text
        const statusMap: Record<string, string> = {
            'ESTIMATE': 'is currently in the estimate phase.',
            'APPROVED': 'has been approved and is queued for work.',
            'IN_PROGRESS': 'is being worked on right now.',
            'PAINT': 'is in the paint booth.',
            'QUALITY_CHECK': 'is undergoing final quality checks.',
            'COMPLETE': 'is ready for pickup.'
        };

        const statusText = statusMap[job.status] || `is marked as ${job.status}.`;

        return res.json({
            success: true,
            found: true,
            message: `I found the ${job.vehicle}. It ${statusText} Services: ${job.services}.`
        });

    } catch (error) {
        console.error('Status Error:', error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};
