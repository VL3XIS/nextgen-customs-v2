
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Demo Data...");

    // 1. Create Default Shop Owner
    const user = await prisma.user.create({
        data: {
            email: "demo@nextgencustoms.com",
            passwordHash: "hashed_dummy_pass",
            shopName: "NextGen Customs",
        }
    });

    console.log("✅ Created User:", user.id);

    // 2. High Value Client with History
    // We represent clients essentially as recurring Names/Emails in Jobs for now so simpler schema
    // But let's create a solid history for "Marcus Aurelius" (High Value)

    const highValueJobs = [
        { vehicle: "2024 Lamborghini Revuelto", service: "Full Body PPF & Ceramic", val: 12000, status: "COMPLETE" },
        { vehicle: "2023 Porsche 911 GT3 RS", service: "Custom Livery Wrap", val: 8500, status: "COMPLETE" },
        { vehicle: "1967 Shelby GT500", service: "Restoration Phase 1", val: 45000, status: "IN_PROGRESS" }
    ];

    for (const job of highValueJobs) {
        await prisma.job.create({
            data: {
                userId: user.id,
                customerName: "Marcus Aurelius",
                customerEmail: "marcus@rome.empire",
                vehicle: job.vehicle,
                services: job.service,
                estimatedValue: job.val,
                status: job.status as any
            }
        });
    }

    // 3. Active Jobs (The ones we want Ms. Walker to find)
    const activeJobs = [
        { name: "John Doe", vehicle: "2019 Ford F-150", service: "Collision Repair", status: "IN_PROGRESS" },
        { name: "Alice Smith", vehicle: "2022 Tesla Model 3", service: "Bumper Replacement", status: "APPROVED" }, // Waiting parts usually
        { name: "Bob Jones", vehicle: "2015 Honda Civic", service: "Detailing", status: "COMPLETE" }
    ];

    for (const j of activeJobs) {
        await prisma.job.create({
            data: {
                userId: user.id,
                customerName: j.name,
                vehicle: j.vehicle,
                services: j.service,
                status: j.status as any,
                estimatedValue: 1500
            }
        });
    }

    // 4. Future Appointments (For Calendar)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await prisma.appointment.create({
        data: {
            userId: user.id,
            customerName: "Vinnie Chase",
            customerPhone: "555-0000",
            date: tomorrow,
            appointmentType: "consultation",
            status: "CONFIRMED"
        }
    });

    console.log("✅ Database Seeded Successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
