import { Request, Response } from 'express';
import prisma from '../config/database';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const getAnalyticsSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        const [totalJobs, totalPosts, analyticsData] = await Promise.all([
            prisma.job.count({ where: { userId } }),
            prisma.post.count({ where: { job: { userId } } }),
            prisma.analytics.aggregate({
                where: { userId },
                _sum: {
                    timeSavedMinutes: true,
                }
            })
        ]);

        // Mock data for charts (since we don't have historical data yet)
        const postsOverTime = [
            { date: '2023-10-01', count: 12 },
            { date: '2023-10-08', count: 19 },
            { date: '2023-10-15', count: 3 },
            { date: '2023-10-22', count: 5 },
        ];

        const byPlatform = [
            { name: 'Instagram', value: Math.floor(totalPosts * 0.4) },
            { name: 'Facebook', value: Math.floor(totalPosts * 0.35) },
            { name: 'LinkedIn', value: Math.floor(totalPosts * 0.25) },
        ];

        res.json({
            success: true,
            summary: {
                totalJobs,
                totalPosts,
                timeSavedMinutes: analyticsData._sum.timeSavedMinutes || 0,
            },
            charts: {
                postsOverTime,
                byPlatform
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
};
