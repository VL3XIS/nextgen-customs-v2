import { Request, Response } from 'express';
import prisma from '../config/database';
import { jobCreateSchema } from '../utils/validation';

interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

import { sendJobStatusEmail } from '../services/notificationService';

export const updateJobStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { status } = req.body;

        const job = await prisma.job.findUnique({
            where: { id },
            include: { user: true } // Include user to get email if needed
        });

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

        // Trigger Notification
        // For testing/verified-domain reasons, prioritize the demo recipient so emails actually deliver
        // (Resend Sandbox only allows sending to verified emails)
        const recipientEmail = process.env.DEMO_EMAIL_RECIPIENT || 'alexisruiz1040@gmail.com';

        // Don't await this, let it run in background so UI is snappy
        sendJobStatusEmail({
            to: recipientEmail,
            customerName: job.customerName,
            vehicle: job.vehicle,
            status: status,
            jobId: job.id
        }).catch(err => console.error('Background email failed:', JSON.stringify(err, null, 2)));

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

        console.log('Received body:', req.body);
        console.log('Received files:', req.files);

        const validation = jobCreateSchema.safeParse(req.body);
        if (!validation.success) {
            console.error('Validation failed:', validation.error.format());
            return res.status(400).json({ success: false, error: validation.error.errors[0].message });
        }

        const { vehicle, services, notes, customerName, customerEmail } = validation.data;
        const uploadedFiles = req.files as Express.Multer.File[];

        const job = await prisma.job.create({
            data: {
                userId,
                vehicle,
                customerName,
                customerEmail: customerEmail || null,
                services,
                notes,
                photos: {
                    create: uploadedFiles?.map(file => ({
                        url: `/uploads/${file.filename}`
                    })) || []
                }
            },
            include: {
                photos: true,
                user: true
            }
        });

        // Trigger initial notification
        const recipientEmail = job.customerEmail || process.env.DEMO_EMAIL_RECIPIENT || job.user.email;

        sendJobStatusEmail({
            to: recipientEmail,
            customerName: job.customerName,
            vehicle: job.vehicle,
            status: 'Received',
            jobId: job.id
        }).catch(err => console.error('Initial background email failed:', err));

        res.status(201).json({ success: true, job });
    } catch (error: any) {
        console.error('Create job error deep trace:', error);
        res.status(500).json({ success: false, error: error.message || 'Server error creating job' });
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
