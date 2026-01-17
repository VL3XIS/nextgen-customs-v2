import express from 'express';
import { createJob, getJobs, getJobById, deleteJob, updateJobStatus } from '../controllers/jobController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../config/multer';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.post('/', upload.array('photos', 10), createJob);
router.get('/', getJobs);
router.put('/:id/status', updateJobStatus);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);

export default router;
