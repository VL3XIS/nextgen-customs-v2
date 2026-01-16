import express from 'express';
import { createJob, getJobs, getJobById, deleteJob, updateJobStatus } from '../controllers/jobController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.post('/', createJob);
router.get('/', getJobs);
router.put('/:id/status', updateJobStatus);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);

export default router;
