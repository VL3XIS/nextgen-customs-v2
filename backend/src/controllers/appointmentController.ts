
import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAppointments = async (req: Request, res: Response) => {
    try {
        console.log('GET /appointments');
        // Optional: Filter by date range if provided in query
        // const { start, end } = req.query; 

        // For now, fetch all future appointments (or last 30 days + future)
        const appointments = await prisma.appointment.findMany({
            orderBy: { date: 'asc' },
            where: {
                status: { not: 'CANCELLED' } // Show valid ones
            }
        });

        // Transform for Frontend if needed, or send raw
        return res.json(appointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { customer_name, customer_phone, customer_email, scheduled_date, scheduled_time, appointment_type, vehicle_info, special_notes } = req.body;

        const isoDate = new Date(`${scheduled_date}T${scheduled_time}:00`);

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
