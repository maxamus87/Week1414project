import { Router } from "express";
import { geocodeQuery } from "../controllers/geocodeController.js";

const router = Router();

router.get("/", geocodeQuery);

export default router;
