
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Demo Data Seeding...");

    // 1. Get or Create Default User (Required for Jobs)
    const email = "admin@nextgen.com";
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log("Creating default user...");
        const passwordHash = await bcrypt.hash("password123", 10);
        user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                shopName: "NextGen Customs",
            }
        });
    }

    const userId = user.id;

    // 2. Clear existing dynamic data to avoid duplicates/conflicts
    await prisma.appointment.deleteMany({});
    await prisma.job.deleteMany({ where: { userId } });

    // 3. Seed Jobs (Revenue & Status)
    console.log("Creating Jobs...");

    // High Value Completed Jobs (Revenue History)
    await prisma.job.createMany({
        data: [
            {
                userId,
                customerName: "Michael Corleone",
                vehicle: "1941 Packard Custom",
                status: "COMPLETE",
                estimatedValue: 15000,
                services: "Restoration",
                notes: "Full restoration and interior."
            },
            {
                userId,
                customerName: "Tony Stark",
                vehicle: "2024 Audi R8",
                status: "COMPLETE",
                estimatedValue: 8500,
                services: "Wrap, Ceramic",
                notes: "Matte black wrap and ceramic coating."
            },
            {
                userId,
                customerName: "Bruce Wayne",
                vehicle: "Lamborghini Murcielago",
                status: "COMPLETE",
                estimatedValue: 22000,
                services: "PPF, Body Kit",
                notes: "Stealth PPF and custom body kit."
            }
        ]
    });

    // Active Jobs (Shop Status)
    // Valid Status: ESTIMATE, APPROVED, IN_PROGRESS, PAINT, QUALITY_CHECK, COMPLETE
    await prisma.job.createMany({
        data: [
            {
                userId,
                customerName: "Dominic Toretto",
                vehicle: "1970 Dodge Charger",
                status: "IN_PROGRESS",
                estimatedValue: 12000,
                services: "Performance",
                notes: "Engine swap and supercharger install."
            },
            {
                userId,
                customerName: "Brian O'Conner",
                vehicle: "1999 Nissan Skyline GTR",
                status: "APPROVED", // Was WAITING_PARTS (invalid)
                estimatedValue: 4500,
                services: "Performance",
                notes: "Waiting for NOS kit intake manifold."
            },
            {
                userId,
                customerName: "Han Lue",
                vehicle: "Mazda RX-7",
                status: "PAINT",
                estimatedValue: 9000,
                services: "Body",
                notes: "VeilSide widebody kit fitting."
            }
        ]
    });

    // 4. Seed Appointments (Calendar)
    console.log("Creating Appointments...");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Valid Status: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
    await prisma.appointment.createMany({
        data: [
            {
                userId, // Optional but good to link
                customerName: "Frank Castle",
                customerPhone: "555-0199",
                customerEmail: "frank@punisher.com",
                vehicleModel: "Battle Van",
                date: new Date(tomorrow.setHours(10, 0, 0, 0)),
                appointmentType: "consultation",
                status: "CONFIRMED"
            },
            {
                userId,
                customerName: "Matt Murdock",
                customerPhone: "555-0188",
                customerEmail: "matt@nelsonmurdock.com",
                vehicleModel: "Subaru WRX",
                date: new Date(today.setHours(14, 30, 0, 0)), // Today 2:30 PM
                appointmentType: "inspection",
                status: "CONFIRMED"
            },
            {
                userId,
                customerName: "Peter Parker",
                customerPhone: "555-0177",
                customerEmail: "peter@dailybugle.com",
                vehicleModel: "Vespa Scooter",
                date: new Date(nextWeek.setHours(9, 0, 0, 0)),
                appointmentType: "pickup",
                status: "SCHEDULED" // Was PENDING (invalid)
            }
        ]
    });

    console.log("✅ Demo Data Seeded Successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
