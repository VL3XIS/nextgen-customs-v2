
console.log('EmailService: File loading...');
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);
console.log('EmailService: Resend Initialized (MOCKED)');

export const sendPremiumConfirmation = async (data: {
    customerName: string,
    customerEmail: string,
    appointmentDate: string,
    appointmentTime: string,
    appointmentType: string,
    vehicleModel?: string,
    notes?: string
}) => {
    console.log("MOCK EMAIL SENT:", data);
    return;
};
