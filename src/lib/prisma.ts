import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ||
  "mongodb+srv://fahadislam905_db_user:fahad21291DB2026@exam-prep-platform.bcpmrae.mongodb.net/google_ai_pro?retryWrites=true&w=majority&appName=Exam-Prep-Platform&connectTimeoutMS=5000&socketTimeoutMS=10000&maxPoolSize=10";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: databaseUrl,
    log: ["error"],
  });

// Always cache client on globalThis to reuse connections across serverless cold/warm invocations
globalForPrisma.prisma = prisma;

export default prisma;
