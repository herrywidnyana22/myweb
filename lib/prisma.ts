import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined. Please set it in your .env file.');
}

// Validate connection string format
if (!connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
  throw new Error('DATABASE_URL must start with postgres:// or postgresql://');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Parse connection string to check for issues
let poolConfig: any;
try {
  poolConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Prisma Postgres and most cloud databases
    },
    max: 10, // Maximum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} catch (error) {
  console.error('Error parsing DATABASE_URL:', error);
  throw new Error('Invalid DATABASE_URL format');
}

// Use pg Pool for Prisma Postgres
const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err);
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
