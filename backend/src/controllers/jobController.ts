import { Request, Response } from 'express';
import prisma from '../config/database';
import { jobCreateSchema } from '../utils/validation';

interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const updateJobStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { status } = req.body;

        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        if (job.userId !== userId) {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        const updatedJob = await prisma.job.update({
            where: { id },
            data: { status },
        });

        res.json({ success: true, job: updatedJob });
    } catch (error) {
        console.error('Update job status error:', error);
        res.status(500).json({ success: false, error: 'Server error updating job status' });
    }
};

export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const validation = jobCreateSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error.errors[0].message });
        }

        const { vehicle, services, notes } = validation.data;

        const job = await prisma.job.create({
            data: {
                userId,
                vehicle,
                customerName: validation.data.customerName,
                services,
                notes,
            },
        });

        res.status(201).json({ success: true, job });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ success: false, error: 'Server error creating job' });
    }
};

export const getJobs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const jobs = await prisma.job.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });

        const total = await prisma.job.count({ where: { userId } });

        res.json({
            success: true,
            jobs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ success: false, error: 'Server error fetching jobs' });
    }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                photos: true,
                posts: true
            }
        });

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        if (job.userId !== userId) {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        res.json({ success: true, job });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ success: false, error: 'Server error fetching job details' });
    }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        if (job.userId !== userId) {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        await prisma.job.delete({ where: { id } });

        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ success: false, error: 'Server error deleting job' });
    }
};
