import { seedDatabase } from "./seed";

async function main() {
  await seedDatabase();
  console.log("Supabase database seed completed successfully.");
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
