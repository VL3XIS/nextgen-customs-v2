import { Request, Response } from 'express';
import prisma from '../config/database';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const getAnalyticsSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        const [totalJobs, totalPosts, analyticsData, activeClientsCount, pipelineRevenue] = await Promise.all([
            prisma.job.count({ where: { userId } }),
            prisma.post.count({ where: { job: { userId } } }),
            prisma.analytics.aggregate({
                where: { userId },
                _sum: {
                    timeSavedMinutes: true,
                }
            }),
            // Count unique customers with active jobs (simplification: just counting active jobs for now to ensure speed, 
            // or we can use distinct if Prisma supports it easily. GroupBy is better for distinct.)
            prisma.job.groupBy({
                by: ['customerName'],
                where: {
                    userId,
                    status: {
                        notIn: ['COMPLETE'] // Assuming CANCELLED doesn't exist yet based on STEPS, but check schema if needed. 
                        // Status enum is ESTIMATE, APPROVED, IN_PROGRESS, PAINT, QUALITY_CHECK, COMPLETE.
                    }
                },
                _count: true
            }).then(groups => groups.length),

            // Calculate Pipeline Revenue (Sum of estimatedValue for non-complete jobs)
            prisma.job.aggregate({
                where: {
                    userId,
                    status: {
                        notIn: ['COMPLETE']
                    }
                },
                _sum: {
                    estimatedValue: true
                }
            })
        ]);

        // Generate dynamic chart data for the last 7 days
        const postsOverTime = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // Count posts on this day
            const startOfDay = new Date(d.setHours(0, 0, 0, 0));
            const endOfDay = new Date(d.setHours(23, 59, 59, 999));

            const count = await prisma.post.count({
                where: {
                    job: { userId },
                    generatedAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });

            postsOverTime.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count
            });
        }

        const platformStats = await prisma.post.groupBy({
            by: ['platform'],
            where: { job: { userId } },
            _count: { platform: true }
        });

        const byPlatform = platformStats.map(stat => ({
            name: stat.platform.charAt(0).toUpperCase() + stat.platform.slice(1),
            value: stat._count.platform
        }));

        // Fallback for empty state
        if (byPlatform.length === 0) {
            byPlatform.push(
                { name: 'Instagram', value: 0 },
                { name: 'Facebook', value: 0 },
                { name: 'LinkedIn', value: 0 }
            );
        }

        res.json({
            success: true,
            summary: {
                totalJobs,
                totalPosts,
                timeSavedMinutes: analyticsData._sum.timeSavedMinutes || 0,
                activeClients: activeClientsCount,
                pipelineRevenue: pipelineRevenue._sum.estimatedValue || 0
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
