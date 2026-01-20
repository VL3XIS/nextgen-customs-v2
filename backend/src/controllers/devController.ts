
import { Request, Response } from 'express';
import prisma from '../config/database';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const seedMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

        console.log(`🌱 Seeding data for User: ${userId}`);

        // 1. Wipe existing data for this user to prevent duplicates/mess
        await prisma.job.deleteMany({ where: { userId } });
        await prisma.analytics.deleteMany({ where: { userId } });
        // Posts cascade delete with jobs

        // 2. Create Jobs
        const vehicles = ['2023 Tesla Model S Plaid', '1969 Camaro SS', '2024 Porsche 911 GT3', '2022 Ford Raptor R', '2025 BMW M4 Comp'];
        const services = ['Ceramic Coating (5 Year)', 'Full XPEL Stealth Wrap', 'Paint Correction (Stage 2)', 'Chrome Delete & Tints', 'Interior Detail & Leather'];

        const jobs = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 45)); // Past 45 days

            const job = await prisma.job.create({
                data: {
                    userId,
                    customerName: `Client ${i + 1}`,
                    vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
                    services: services[Math.floor(Math.random() * services.length)],
                    status: i < 5 ? 'COMPLETE' : (i < 8 ? 'IN_PROGRESS' : 'ESTIMATE'),
                    estimatedValue: Math.floor(Math.random() * 5000) + 800,
                    createdAt: date,
                    updatedAt: date
                }
            });
            jobs.push(job);
        }

        // 3. Create Social Posts for completed jobs
        const completedJobs = jobs.filter(j => j.status === 'COMPLETE');
        for (const job of completedJobs) {
            await prisma.post.create({
                data: {
                    jobId: job.id,
                    platform: 'instagram',
                    caption: `Another masterpiece complete! 🔥 This ${job.vehicle} received our ${job.services} package. #NextGenCustoms`,
                    hashtags: ['#auto', '#detailing', '#ceramic'],
                    status: 'published',
                    generatedAt: job.updatedAt
                }
            });
        }

        // 4. Update Analytics
        await prisma.analytics.create({
            data: {
                userId,
                timeSavedMinutes: 840, // 14 hours
                postsGenerated: completedJobs.length * 3,
                jobsCompleted: completedJobs.length
            }
        });

        console.log(`✅ Seed Complete for ${userId}`);
        res.json({ success: true, message: 'Account seeded successfully! Refreshing...' });

    } catch (error) {
        console.error('Seed Error:', error);
        res.status(500).json({ success: false, error: 'Failed to seed account.' });
    }
};
