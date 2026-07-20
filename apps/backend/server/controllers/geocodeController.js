import { geocodeAddress } from "../utils/geocode.js";

export async function geocodeQuery(req, res, next) {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ message: "query is required" });
  }

  try {
    const coordinates = await geocodeAddress(query);

    if (!coordinates) {
      return res.status(404).json({ message: "Could not find that location" });
    }

    res.json({ data: coordinates });
  } catch (error) {
    next(error);
  }
}
