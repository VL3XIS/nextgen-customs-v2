import express from 'express';
import { getPublicJobStatus } from '../controllers/publicController';
import { Resend } from 'resend';

const router = express.Router();

// No auth middleware here - accessible to world
router.get('/jobs/:id', getPublicJobStatus);

router.get('/test-email', async (req, res) => {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.DEMO_EMAIL_RECIPIENT || 'alexisruiz1040@gmail.com';

    if (!key) {
        return res.status(500).json({
            success: false,
            error: 'No RESEND_API_KEY found in env',
            envKeys: Object.keys(process.env).filter(k => k.includes('RESEND'))
        });
    }

    try {
        const resend = new Resend(key);
        const { data, error } = await resend.emails.send({
            from: 'Next Gen Customs <updates@resend.dev>',
            to: [to],
            subject: 'Test Email from Vercel Backend',
            html: '<h1>It Works!</h1><p>Your Vercel backend can send emails.</p>'
        });

        if (error) {
            return res.status(400).json({ success: false, error });
        }

        return res.json({
            success: true,
            data,
            message: `Sent to ${to}`,
            version: "v2-forced-update"
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message, stack: err.stack });
    }
});

export default router;
