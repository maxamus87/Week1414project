import { apiRequest } from "./client.js";

export function fetchShops({ search, city, sort } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (city) params.set("city", city);
  if (sort) params.set("sort", sort);

  const query = params.toString();
  return apiRequest(`/shops${query ? `?${query}` : ""}`);
}

export function fetchShop(id) {
  return apiRequest(`/shops/${id}`);
}

export function createShop(shop, token) {
  return apiRequest("/shops", { method: "POST", body: shop, token });
}

export function updateShop(id, shop, token) {
  return apiRequest(`/shops/${id}`, { method: "PUT", body: shop, token });
}

export function deleteShop(id, token) {
  return apiRequest(`/shops/${id}`, { method: "DELETE", token });
}
