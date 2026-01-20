
import express from 'express';
import { seedMe } from '../controllers/devController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/seed-me', seedMe);

export default router;
