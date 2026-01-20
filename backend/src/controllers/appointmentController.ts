
import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAppointments = async (req: Request, res: Response) => {
    try {
        console.log('GET /appointments');

        // 1. Fetch Local DB Appointments
        const dbAppointments = await prisma.appointment.findMany({
            orderBy: { date: 'asc' },
            where: {
                status: { not: 'CANCELLED' }
            }
        });

        // 2. Fetch Google Calendar Events (Live Feed)
        // Default window: -1 month to +3 months to cover standard viewing range
        const now = new Date();
        const start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        const end = new Date(now);
        end.setMonth(end.getMonth() + 3);

        let googleEvents: any[] = [];
        try {
            googleEvents = await calendarService.listEvents(start, end);
        } catch (err) {
            console.error("Failed to fetch Google Calendar events:", err);
            // Don't crash, just continue with DB only
        }

        // 3. Deduplicate & Merge
        // Create a set of IDs we already have locally to avoid duplicates
        const localGoogleIds = new Set(dbAppointments.map(a => a.googleEventId).filter(Boolean));

        const externalAppointments = googleEvents
            .filter((event: any) => event.id && !localGoogleIds.has(event.id) && event.start?.dateTime)
            .map((event: any) => {
                // Heuristic parsing of title: "Customer Name - Service (Vehicle)"
                const summary = event.summary || "Busy";
                let customerName = summary;
                let vehicleModel = "External Event";
                let type = "Google Calendar";

                if (summary.includes('-')) {
                    const parts = summary.split('-');
                    customerName = parts[0].trim();
                    // Try to extract vehicle from parens if present
                    if (summary.includes('(') && summary.includes(')')) {
                        const match = summary.match(/\(([^)]+)\)/);
                        if (match) vehicleModel = match[1];
                    }
                }

                return {
                    id: `gcal_${event.id}`, // specific prefix to avoid collision
                    date: event.start.dateTime,
                    customerName: customerName,
                    customerPhone: "",
                    customerEmail: "",
                    appointmentType: type,
                    vehicleModel: vehicleModel,
                    notes: event.description || "",
                    status: 'CONFIRMED', // Treat external events as confirmed blocks
                    googleEventId: event.id
                };
            });

        // Combine and Sort
        const allAppointments = [...dbAppointments, ...externalAppointments].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return res.json(allAppointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = { emails: { send: async () => ({}) } }; // Mock locally
import { calendarService } from '../services/calendarService';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { customer_name, customer_phone, customer_email, scheduled_date, scheduled_time, full_date_iso, appointment_type, vehicle_info, special_notes } = req.body;

        // Use full_date_iso if available (frontend fix), otherwise fallback to the old method
        const isoDate = full_date_iso ? new Date(full_date_iso) : new Date(`${scheduled_date}T${scheduled_time}:00`);

        const newAppt = await prisma.appointment.create({
            data: {
                customerName: customer_name,
                customerPhone: customer_phone,
                customerEmail: customer_email,
                date: isoDate,
                appointmentType: appointment_type || 'consultation',
                vehicleModel: vehicle_info?.model || 'Unknown',
                notes: special_notes,
                status: 'CONFIRMED'
            }
        });

        // Sync to Google Calendar
        let googleEventId = null;
        try {
            const endDateTime = new Date(isoDate.getTime() + 30 * 60000);
            googleEventId = await calendarService.createEvent({
                summary: `${customer_name} - ${appointment_type || 'consultation'} (${vehicle_info?.model || 'Unknown'})`,
                description: `Customer: ${customer_name}\nPhone: ${customer_phone}\nVehicle: ${vehicle_info?.model || 'Unknown'}\nNotes: ${special_notes}`,
                startDateTime: isoDate,
                endDateTime: endDateTime
            });

            if (googleEventId) {
                await prisma.appointment.update({
                    where: { id: newAppt.id },
                    data: { googleEventId }
                });
            }
        } catch (calErr) {
            console.error("Manual Booking Google Sync Failed:", calErr);
        }

        // Send Confirmation Email
        let emailStatus = 'skipped';
        const apiKey = process.env.RESEND_API_KEY;

        if (apiKey && customer_email) {
            try {
                console.log('Manual Appt: Attempting to send email via Resend to', customer_email);
                await resend.emails.send({
                    from: 'NextGen Customs <onboarding@resend.dev>',
                    to: ['alexisruiz1040@gmail.com'], // Hardcoded override for demo
                    subject: `Appointment Confirmed: ${scheduled_date} @ ${scheduled_time}`,
                    html: `
                        <h1>Appointment Confirmed</h1>
                        <p>Hi ${customer_name},</p>
                        <p>You are booked for a <strong>${appointment_type}</strong> on <strong>${scheduled_date} at ${scheduled_time}</strong>.</p>
                        <p>Vehicle: ${vehicle_info?.model || 'N/A'}</p>
                        <p>Thank you for choosing NextGen Customs!</p>
                    `
                });
                console.log('Manual Appt: Email Sent Successfully!');
                emailStatus = 'sent';
            } catch (emailErr) {
                console.error("Manual Appt: Email Failed:", emailErr);
                emailStatus = 'failed';
            }
        }

        return res.json({ ...newAppt, email_status: emailStatus });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ error: 'Failed to create appointment' });
    }
};
