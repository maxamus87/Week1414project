import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite, setVisited } from "../controllers/favoriteController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getFavorites);
router.post("/", requireAuth, addFavorite);
router.patch("/:shopId", requireAuth, setVisited);
router.delete("/:shopId", requireAuth, removeFavorite);

export default router;
