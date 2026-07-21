import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import shopRoutes from "./routes/shops.js";
import reviewRoutes from "./routes/reviews.js";
import favoriteRoutes from "./routes/favorites.js";
import geocodeRoutes from "./routes/geocode.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/geocode", geocodeRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

export default app;
