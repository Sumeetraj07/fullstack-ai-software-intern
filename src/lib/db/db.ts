import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

let isConnected = false;
let checkAttempted = false;

export async function checkDbConnection(): Promise<boolean> {
  if (checkAttempted) return isConnected;
  
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL is not set. Falling back to in-memory mock database.");
    isConnected = false;
    checkAttempted = true;
    return false;
  }

  try {
    // Attempt a quick query to test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("🚀 PostgreSQL database connected successfully via Prisma.");
    isConnected = true;
  } catch (error) {
    console.warn("⚠️ Failed to connect to PostgreSQL database via Prisma. Falling back to in-memory mock database.");
    console.error(error);
    isConnected = false;
  }
  
  checkAttempted = true;
  return isConnected;
}

// Helper to determine if we should use Prisma or mock database
export async function getDbMode(): Promise<boolean> {
  return await checkDbConnection();
}
