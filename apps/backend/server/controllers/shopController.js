import prisma from "../db/prisma.js";

const SORT_OPTIONS = {
  rating: `"averageRating" DESC`,
  newest: `s.created_at DESC`,
  name: `s.name ASC`
};

export async function getShops(req, res, next) {
  const { search, city, sort } = req.query;
  const orderBy = SORT_OPTIONS[sort] ?? SORT_OPTIONS.name;

  try {
    // Raw parameterized query with a JOIN + aggregate to attach each shop's
    // average rating and review count from the related reviews table.
    const shops = await prisma.$queryRawUnsafe(
      `
      SELECT
        s.id,
        s.name,
        s.address,
        s.city,
        s.description,
        s.website,
        s.created_by AS "createdBy",
        s.created_at AS "createdAt",
        COALESCE(AVG(r.rating), 0)::float AS "averageRating",
        COUNT(r.id)::int AS "reviewCount"
      FROM shops s
      LEFT JOIN reviews r ON r.shop_id = s.id
      WHERE ($1::text IS NULL OR s.name ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR s.city ILIKE '%' || $2 || '%')
      GROUP BY s.id
      ORDER BY ${orderBy}
      `,
      search ?? null,
      city ?? null
    );

    res.json({ data: shops });
  } catch (error) {
    next(error);
  }
}

export async function getShop(req, res, next) {
  const { id } = req.params;

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: Number(id) },
      include: {
        owner: { select: { id: true, name: true } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const reviewCount = shop.reviews.length;
    const averageRating = reviewCount
      ? shop.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    res.json({ data: { ...shop, averageRating, reviewCount } });
  } catch (error) {
    next(error);
  }
}

export async function createShop(req, res, next) {
  const { name, city, address, description, website } = req.body;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and city are required" });
  }

  try {
    const shop = await prisma.shop.create({
      data: { name, city, address, description, website, createdBy: req.userId }
    });

    res.status(201).json({ message: "Shop created successfully", data: shop });
  } catch (error) {
    next(error);
  }
}

export async function updateShop(req, res, next) {
  const { id } = req.params;
  const { name, city, address, description, website } = req.body;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and city are required" });
  }

  try {
    const shop = await prisma.shop.findUnique({ where: { id: Number(id) } });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.createdBy !== req.userId) {
      return res.status(403).json({ message: "You can only edit shops you created" });
    }

    const updated = await prisma.shop.update({
      where: { id: Number(id) },
      data: { name, city, address, description, website }
    });

    res.json({ message: "Shop updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteShop(req, res, next) {
  const { id } = req.params;

  try {
    const shop = await prisma.shop.findUnique({ where: { id: Number(id) } });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.createdBy !== req.userId) {
      return res.status(403).json({ message: "You can only delete shops you created" });
    }

    await prisma.shop.delete({ where: { id: Number(id) } });

    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    next(error);
  }
}
