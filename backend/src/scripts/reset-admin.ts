import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function resetAdmin() {
    try {
        const email = 'admin@example.com';
        const password = 'password';
        const shopName = 'NextGen Customs Headquarters';

        console.log(`Resetting admin user: ${email}`);

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Upsert the user: create if not exists, update password if exists
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash,
                shopName, // Update shop name just in case
            },
            create: {
                email,
                passwordHash,
                shopName,
            },
        });

        console.log(`Admin user upserted successfully. ID: ${user.id}`);
        console.log(`Credentials: ${email} / ${password}`);

    } catch (error) {
        console.error('Error resetting admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
