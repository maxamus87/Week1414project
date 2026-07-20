import "dotenv/config";
import prisma from "../server/db/prisma.js";

const DEMO_PASSWORD_HASH = "$2b$10$KeE4ed5iNFH74.YvQe3TRO8mzzWPfNNZdcy2qecLXHUhtsNZp.kZK"; // password123

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  const maria = await prisma.user.create({
    data: { email: "maria@example.com", passwordHash: DEMO_PASSWORD_HASH, name: "Maria Chen" }
  });

  const devon = await prisma.user.create({
    data: { email: "devon@example.com", passwordHash: DEMO_PASSWORD_HASH, name: "Devon Reyes" }
  });

  const rooted = await prisma.shop.create({
    data: {
      name: "Rooted Coffee House",
      address: "412 Elm St",
      city: "Asheville",
      state: "North Carolina",
      description: "Cozy neighborhood roaster with single-origin pour-overs.",
      website: "https://rootedcoffee.example.com",
      latitude: 35.5951,
      longitude: -82.5515,
      createdBy: maria.id
    }
  });

  const dailyGrind = await prisma.shop.create({
    data: {
      name: "The Daily Grind",
      address: "89 Market Ave",
      city: "Asheville",
      state: "North Carolina",
      description: "Fast, friendly espresso bar near downtown.",
      latitude: 35.5978,
      longitude: -82.554,
      createdBy: maria.id
    }
  });

  const foothills = await prisma.shop.create({
    data: {
      name: "Foothills Roast Co.",
      address: "215 Ridge Rd",
      city: "Hendersonville",
      state: "North Carolina",
      description: "Small-batch roastery with a quiet reading nook.",
      website: "https://foothillsroast.example.com",
      latitude: 35.3187,
      longitude: -82.461,
      createdBy: devon.id
    }
  });

  const fifthAndBean = await prisma.shop.create({
    data: {
      name: "5th & Bean",
      address: "5 Fifth St",
      city: "Hendersonville",
      state: "North Carolina",
      description: "Family-owned shop known for its oat milk lattes.",
      latitude: 35.321,
      longitude: -82.4585,
      createdBy: devon.id
    }
  });

  await prisma.review.createMany({
    data: [
      { shopId: rooted.id, userId: devon.id, rating: 5, comment: "Best pour-over in town, super welcoming staff." },
      { shopId: rooted.id, userId: maria.id, rating: 4, comment: "Great coffee, gets crowded on weekend mornings." },
      { shopId: dailyGrind.id, userId: devon.id, rating: 3, comment: "Solid quick stop but seating is limited." },
      { shopId: foothills.id, userId: maria.id, rating: 5, comment: "Quiet spot, perfect for working. Excellent light roast." },
      { shopId: fifthAndBean.id, userId: maria.id, rating: 4, comment: "Loved the oat milk latte, friendly owners." }
    ]
  });

  await prisma.favorite.createMany({
    data: [
      { userId: maria.id, shopId: foothills.id, saved: true, visited: true },
      { userId: maria.id, shopId: fifthAndBean.id, saved: true, visited: false },
      { userId: devon.id, shopId: rooted.id, saved: true, visited: true }
    ]
  });
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
