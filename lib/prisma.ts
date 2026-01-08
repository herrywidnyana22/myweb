import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

if (!process.env.PRISMA_ACCELERATE_URL) {
  throw new Error('PRISMA_ACCELERATE_URL is not set')
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
