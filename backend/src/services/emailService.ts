
console.log('EmailService: File loading...');
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log('EmailService: Resend Initialized');

export const sendPremiumConfirmation = async (data: {
    customerName: string,
    customerEmail: string,
    appointmentDate: string,
    appointmentTime: string,
    appointmentType: string,
    vehicleModel?: string,
    notes?: string
}) => {
    console.log("Sending email to:", data.customerEmail);
    try {
        await resend.emails.send({
            from: 'NextGen Customs <onboarding@resend.dev>',
            to: ['alexisruiz1040@gmail.com'], // Restricted to verified email in test
            subject: `Appointment Confirmed: ${data.appointmentDate}`,
            html: `
                <h1>Appointment Confirmation</h1>
                <p>Hello ${data.customerName},</p>
                <p>Your appointment for <strong>${data.appointmentType}</strong> is confirmed for <strong>${data.appointmentDate} at ${data.appointmentTime}</strong>.</p>
                <p>Thank you!</p>
            `
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};
