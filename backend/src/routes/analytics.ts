import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/summary', getAnalyticsSummary);

export default router;
