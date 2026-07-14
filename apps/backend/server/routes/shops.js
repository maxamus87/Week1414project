import { Router } from "express";
import {
  createShop,
  deleteShop,
  getShop,
  getShops,
  updateShop
} from "../controllers/shopController.js";
import { createReview } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getShops);
router.get("/:id", getShop);
router.post("/", requireAuth, createShop);
router.put("/:id", requireAuth, updateShop);
router.delete("/:id", requireAuth, deleteShop);
router.post("/:id/reviews", requireAuth, createReview);

export default router;
