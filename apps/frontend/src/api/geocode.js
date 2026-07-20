import { apiRequest } from "./client.js";

export function geocodeAddress(query) {
  return apiRequest(`/geocode?query=${encodeURIComponent(query)}`);
}
