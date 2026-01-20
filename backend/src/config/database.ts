import { PrismaClient } from '@prisma/client';

console.log('DB: Initializing PrismaClient...');
const prisma = new PrismaClient();
console.log('DB: PrismaClient Initialized.');

export default prisma;
