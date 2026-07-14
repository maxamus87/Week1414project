import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getFavorites);
router.post("/", requireAuth, addFavorite);
router.delete("/:shopId", requireAuth, removeFavorite);

export default router;
