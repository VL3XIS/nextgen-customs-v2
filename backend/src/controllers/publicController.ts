import { Request, Response } from 'express';
import prisma from '../config/database';

export const getPublicJobStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Use include to get relations, then map to safe object
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                photos: {
                    select: {
                        id: true,
                        url: true,
                        uploadedAt: true
                    },
                    orderBy: { uploadedAt: 'desc' }
                }
            }
        });

        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        // Return only what's safe
        const publicData = {
            id: job.id,
            vehicle: job.vehicle,
            customerName: job.customerName,
            status: job.status,
            lastUpdate: job.updatedAt,
            photos: job.photos
        };

        res.json({ success: true, job: publicData });
    } catch (error) {
        console.error('Public job status error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
