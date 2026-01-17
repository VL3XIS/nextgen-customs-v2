import express from 'express';
import { getPublicJobStatus } from '../controllers/publicController';

const router = express.Router();

// No auth middleware here - accessible to world
router.get('/jobs/:id', getPublicJobStatus);

export default router;
