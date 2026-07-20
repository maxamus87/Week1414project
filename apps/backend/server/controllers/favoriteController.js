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

    if (existing?.saved) {
      return res.status(400).json({ message: "Shop is already in your favorites" });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_shopId: { userId: req.userId, shopId: Number(shopId) } },
      update: { saved: true },
      create: { userId: req.userId, shopId: Number(shopId), saved: true, visited: false },
      include: { shop: true }
    });

    res.status(201).json({ message: "Shop added to favorites", data: favorite });
  } catch (error) {
    next(error);
  }
}

export async function setVisited(req, res, next) {
  const { shopId } = req.params;
  const { visited } = req.body;

  if (typeof visited !== "boolean") {
    return res.status(400).json({ message: "visited must be true or false" });
  }

  try {
    const shop = await prisma.shop.findUnique({ where: { id: Number(shopId) } });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_shopId: { userId: req.userId, shopId: Number(shopId) } }
    });

    if (!visited && existing && !existing.saved) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ message: "Visited status updated", data: { shopId: Number(shopId), saved: false, visited: false } });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_shopId: { userId: req.userId, shopId: Number(shopId) } },
      update: { visited },
      create: { userId: req.userId, shopId: Number(shopId), saved: false, visited },
      include: { shop: true }
    });

    res.json({ message: "Visited status updated", data: favorite });
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

    if (!existing?.saved) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    if (existing.visited) {
      await prisma.favorite.update({ where: { id: existing.id }, data: { saved: false } });
    } else {
      await prisma.favorite.delete({ where: { id: existing.id } });
    }

    res.json({ message: "Shop removed from favorites" });
  } catch (error) {
    next(error);
  }
}
