import express from 'express';
import { createAgentLead, checkVehicleStatus } from '../../controllers/api/agent/agentController';

const router = express.Router();

// Public routes for ElevenLabs Agent
// Note: In production, you would verify a custom header secret here
router.post('/lead', createAgentLead);
router.post('/status', checkVehicleStatus);

export default router;
