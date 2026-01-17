import express from 'express';
import { generateJobPosts, getJobPosts, updatePost, regenerateJobPosts } from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/generate', generateJobPosts);
router.post('/regenerate', regenerateJobPosts);
router.get('/:jobId', getJobPosts);
router.put('/:id', updatePost);

export default router;
