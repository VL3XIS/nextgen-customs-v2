
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const appointments = await prisma.appointment.findMany({
        orderBy: { date: 'desc' },
        take: 10
    });
    console.log(JSON.stringify(appointments, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
