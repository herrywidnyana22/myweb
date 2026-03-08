import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({ adapter });

export default prisma;
