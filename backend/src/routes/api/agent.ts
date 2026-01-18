import express from 'express';
import {
    checkAvailability,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    checkVehicleStatus
} from '../../controllers/api/agent/agentController';

const router = express.Router();

// Routes matching ElevenLabs Tool Definitions
router.post('/check-availability', checkAvailability);
router.post('/book-appointment', bookAppointment);
router.post('/reschedule-appointment', rescheduleAppointment);
router.post('/cancel-appointment', cancelAppointment);
router.post('/check-status', checkVehicleStatus);

export default router;
