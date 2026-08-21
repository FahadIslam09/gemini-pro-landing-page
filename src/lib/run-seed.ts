import { seedDatabase } from "./seed";
import { prisma } from "./prisma";

async function main() {
  await seedDatabase();
  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
