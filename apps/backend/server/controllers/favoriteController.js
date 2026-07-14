import prisma from "../db/prisma.js";

export async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: { shop: true },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: favorites });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req, res, next) {
  const { shopId } = req.body;

  if (!shopId) {
    return res.status(400).json({ message: "shopId is required" });
  }

  try {
    const shop = await prisma.shop.findUnique({ where: { id: Number(shopId) } });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_shopId: { userId: req.userId, shopId: Number(shopId) } }
    });

    if (existing) {
      return res.status(400).json({ message: "Shop is already in your favorites" });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.userId, shopId: Number(shopId) },
      include: { shop: true }
    });

    res.status(201).json({ message: "Shop added to favorites", data: favorite });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req, res, next) {
  const { shopId } = req.params;

  try {
    const existing = await prisma.favorite.findUnique({
      where: { userId_shopId: { userId: req.userId, shopId: Number(shopId) } }
    });

    if (!existing) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await prisma.favorite.delete({ where: { id: existing.id } });

    res.json({ message: "Shop removed from favorites" });
  } catch (error) {
    next(error);
  }
}
