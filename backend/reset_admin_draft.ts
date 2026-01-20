import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} exists. Updating password...`);
        await prisma.user.update({
            where: { email },
            data: { passwordHash: hashedPassword }, // Fix: Schema uses passwordHash, not password
        });
        console.log('Password updated.');
    } else {
        console.log(`User ${email} not found. Creating...`);
        await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                shopName: 'NextGen Customs',
            },
        });
        console.log(`User ${email} created.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
