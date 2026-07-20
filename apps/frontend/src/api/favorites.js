import { apiRequest } from "./client.js";

export function fetchFavorites(token) {
  return apiRequest("/favorites", { token });
}

export function addFavorite(shopId, token) {
  return apiRequest("/favorites", { method: "POST", body: { shopId }, token });
}

export function removeFavorite(shopId, token) {
  return apiRequest(`/favorites/${shopId}`, { method: "DELETE", token });
}

export function setVisited(shopId, visited, token) {
  return apiRequest(`/favorites/${shopId}`, { method: "PATCH", body: { visited }, token });
}
