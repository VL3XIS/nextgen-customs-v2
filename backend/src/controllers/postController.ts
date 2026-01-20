import { Request, Response } from 'express';
import prisma from '../config/database';
import { generatePosts } from '../services/claudeService';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const generateJobPosts = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { jobId } = req.body;

        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        if (job.userId !== userId) return res.status(403).json({ success: false, error: 'Access denied' });

        // Generate posts via Claude
        const generatedContent = await generatePosts({
            vehicle: job.vehicle,
            services: job.services,
            notes: job.notes || undefined,
        });

        // Create posts in transaction
        const posts = await prisma.$transaction([
            prisma.post.create({
                data: {
                    jobId,
                    platform: 'instagram',
                    caption: generatedContent.instagram.caption,
                    hashtags: generatedContent.instagram.hashtags,
                },
            }),
            prisma.post.create({
                data: {
                    jobId,
                    platform: 'facebook',
                    caption: generatedContent.facebook.caption,
                    hashtags: [],
                },
            }),
            prisma.post.create({
                data: {
                    jobId,
                    platform: 'linkedin',
                    caption: generatedContent.linkedin.caption,
                    hashtags: [],
                },
            }),
        ]);

        // Update analytics (simple increment for now)
        await prisma.analytics.create({
            data: {
                userId: userId!,
                postsGenerated: 3,
                timeSavedMinutes: 30, // Estimate
            }
        });

        res.json({ success: true, posts });
    } catch (error) {
        console.error('Generate posts error:', error);
        res.status(500).json({ success: false, error: 'Failed to generate posts' });
    }
};

export const getJobPosts = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId } = req.params;
        const posts = await prisma.post.findMany({ where: { jobId } });
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching posts' });
    }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { status } = req.query;

        const posts = await prisma.post.findMany({
            where: {
                job: { userId },
                ...(status ? { status: status as string } : {})
            },
            include: {
                job: true
            },
            orderBy: { generatedAt: 'desc' }
        });

        res.json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching global posts:', error);
        res.status(500).json({ success: false, error: 'Error fetching posts' });
    }
};

export const regenerateJobPosts = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { jobId } = req.body;

        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        if (job.userId !== userId) return res.status(403).json({ success: false, error: 'Access denied' });

        // Delete existing posts first
        await prisma.post.deleteMany({ where: { jobId } });

        // Generate new posts
        const generatedContent = await generatePosts({
            vehicle: job.vehicle,
            services: job.services,
            notes: job.notes || undefined,
        });

        const posts = await prisma.$transaction([
            prisma.post.create({
                data: {
                    jobId,
                    platform: 'instagram',
                    caption: generatedContent.instagram.caption,
                    hashtags: generatedContent.instagram.hashtags,
                },
            }),
            prisma.post.create({
                data: {
                    jobId,
                    platform: 'facebook',
                    caption: generatedContent.facebook.caption,
                    hashtags: [],
                },
            }),
            prisma.post.create({
                data: {
                    jobId,
                    platform: 'linkedin',
                    caption: generatedContent.linkedin.caption,
                    hashtags: [],
                },
            }),
        ]);

        res.json({ success: true, posts });
    } catch (error) {
        console.error('Regenerate posts error:', error);
        res.status(500).json({ success: false, error: 'Failed to regenerate posts' });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { caption, hashtags, status } = req.body;

        const post = await prisma.post.update({
            where: { id },
            data: { caption, hashtags, status }
        });

        res.json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error updating post' });
    }
};
