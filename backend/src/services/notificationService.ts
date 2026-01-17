import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

interface EmailPayload {
    to: string;
    customerName: string;
    vehicle: string;
    status: string;
    jobId: string;
}

export const sendJobStatusEmail = async ({ to, customerName, vehicle, status, jobId }: EmailPayload) => {
    if (!resend) {
        console.log(`[Mock Email] To: ${to} | Subject: Status Update: ${vehicle} | Status: ${status}`);
        return { success: true, mock: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Next Gen Customs <updates@resend.dev>', // Use resend.dev for testing unless they have a domain
            to: [to],
            subject: `Update on your ${vehicle}: ${status}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #333;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #ff2a3c; margin: 0; font-family: 'Arial', sans-serif; text-transform: uppercase; letter-spacing: 2px;">Next Gen Customs</h1>
                    </div>
                    <div style="background: #111; padding: 20px; border-radius: 8px; border: 1px solid #333;">
                        <h2 style="color: #fff; margin-top: 0;">Hello ${customerName},</h2>
                        <p style="color: #ccc; line-height: 1.6;">
                            The status of your <strong>${vehicle}</strong> has been updated to:
                        </p>
                        <div style="background: #ff2a3c; color: white; padding: 15px; text-align: center; border-radius: 5px; font-weight: bold; font-size: 18px; margin: 20px 0; box-shadow: 0 0 15px rgba(255, 42, 60, 0.5);">
                            ${status}
                        </div>
                        <p style="color: #ccc; line-height: 1.6;">
                            Our team is working hard to ensure your vehicle receives the highest quality care. 
                            You can view more details and photos in your portal.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL || 'https://nextgen-customs-v2.vercel.app'}/status/${jobId}" style="background: transparent; border: 1px solid #fff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 14px;">View Job Details</a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Next Gen Customs. All rights reserved.
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Email Service Error:', error);
        return { success: false, error };
    }
};
