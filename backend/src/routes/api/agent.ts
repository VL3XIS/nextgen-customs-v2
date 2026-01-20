import express from 'express';
import {
    checkAvailability,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    checkVehicleStatus,
    listActiveJobs,
    analyzeRevenue,
    searchCustomerHistory,
    generateReport,
    getStaffSchedule
} from '../../controllers/api/agent/agentController';

const router = express.Router();

// Routes matching ElevenLabs Tool Definitions
router.post('/check-availability', checkAvailability);
router.post('/book-appointment', bookAppointment);
router.post('/reschedule-appointment', rescheduleAppointment);
router.post('/cancel-appointment', cancelAppointment);
router.post('/check-status', checkVehicleStatus);
router.post('/list-active-jobs', listActiveJobs);
router.post('/analyze-revenue', analyzeRevenue);
router.post('/search-history', searchCustomerHistory);
router.post('/generate-report', generateReport);
router.post('/get-staff-schedule', getStaffSchedule);

export default router;
