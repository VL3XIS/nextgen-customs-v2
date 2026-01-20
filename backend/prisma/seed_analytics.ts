
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Analytics Data...');

    // 1. Get or Create the main admin user (Alexis)
    const email = 'alexisruiz1040@gmail.com';
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: '$2b$10$EpI/kZ8.q.q.q.q.q.q.q.q.q.q.q', // Dummy hash
            shopName: 'NextGen Customs'
        }
    });

    console.log(`✅ Using User: ${user.email} (${user.id})`);
    const userId = user.id;

    // 2. Create Dummy Jobs (Past 30 Days)
    const jobTypes = ['Ceramic Coating', 'Full Wrap', 'Paint Correction', 'Chrome Delete', 'Interior Detail'];
    const statuses = ['COMPLETE', 'IN_PROGRESS', 'APPROVED', 'ESTIMATE'];
    const vehicles = ['2024 Porsche 911', '2022 Tesla Model S Plaid', '2023 Ford Raptor R', '1969 Camaro SS', '2025 BMW M4 Competition'];

    console.log('Creating Jobs...');
    for (let i = 0; i < 15; i++) {
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

        const job = await prisma.job.create({
            data: {
                userId,
                customerName: `Client ${i + 1}`,
                vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)] as any,
                services: jobTypes[Math.floor(Math.random() * jobTypes.length)], // Fixed: description -> services
                estimatedValue: Math.floor(Math.random() * 4000) + 500,
                createdAt: randomDate,
                updatedAt: randomDate
            }
        });

        // 3. Create Posts for some jobs
        if (Math.random() > 0.3) {
            await prisma.post.create({
                data: {
                    jobId: job.id,
                    platform: Math.random() > 0.5 ? 'instagram' : 'facebook',
                    caption: "Look at this stunning finish! 🔥 #NextGenCustoms", // Fixed: content -> caption
                    generatedAt: randomDate,
                    hashtags: ["#car", "#detailing"] // Added required field
                }
            });
        }
    }

    // 4. Reset & Fill Analytics
    console.log('Updating Analytics Stats...');
    await prisma.analytics.deleteMany({ where: { userId } }); // Cannot upsert on non-unique field
    await prisma.analytics.create({
        data: {
            userId,
            timeSavedMinutes: 420,
            postsGenerated: 12,
            jobsCompleted: 5
        }
    });

    console.log('✅ Analytics Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
