import prisma from "../db/prisma.js";

export async function createReview(req, res, next) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const shopId = Number(id);
  const numericRating = Number(rating);

  if (!rating || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Rating is required and must be an integer from 1 to 5" });
  }

  try {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const review = await prisma.review.create({
      data: { shopId, userId: req.userId, rating: numericRating, comment },
      include: { user: { select: { id: true, name: true } } }
    });

    res.status(201).json({ message: "Review added successfully", data: review });
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req, res, next) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const numericRating = Number(rating);

  if (!rating || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Rating is required and must be an integer from 1 to 5" });
  }

  try {
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own reviews" });
    }

    const updated = await prisma.review.update({
      where: { id: Number(id) },
      data: { rating: numericRating, comment },
      include: { user: { select: { id: true, name: true } } }
    });

    res.json({ message: "Review updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  const { id } = req.params;

  try {
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await prisma.review.delete({ where: { id: Number(id) } });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
}
