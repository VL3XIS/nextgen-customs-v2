import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/token', async (req, res) => {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const agentId = process.env.ELEVENLABS_AGENT_ID;

        if (!apiKey || !agentId) {
            return res.status(500).json({ error: 'Missing ElevenLabs configuration' });
        }

        const response = await axios.get(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
            {
                headers: {
                    'xi-api-key': apiKey,
                },
            }
        );

        res.json({ signedUrl: response.data.signed_url });
    } catch (error) {
        console.error('Error fetching signed URL:', error);
        res.status(500).json({ error: 'Failed to get signed URL' });
    }
});

export default router;
