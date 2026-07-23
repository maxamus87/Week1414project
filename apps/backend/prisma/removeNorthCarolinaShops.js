import "dotenv/config";
import prisma from "../server/db/prisma.js";

async function main() {
  const { count } = await prisma.shop.deleteMany({
    where: { state: "North Carolina" }
  });

  console.log(`Deleted ${count} shops in North Carolina.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
