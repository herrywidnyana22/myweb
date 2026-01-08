import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use pg Pool for Prisma Postgres
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Prisma Postgres
  },
  max: 10, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
