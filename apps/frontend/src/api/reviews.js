import { apiRequest } from "./client.js";

export function createReview(shopId, review, token) {
  return apiRequest(`/shops/${shopId}/reviews`, { method: "POST", body: review, token });
}

export function updateReview(reviewId, review, token) {
  return apiRequest(`/reviews/${reviewId}`, { method: "PUT", body: review, token });
}

export function deleteReview(reviewId, token) {
  return apiRequest(`/reviews/${reviewId}`, { method: "DELETE", token });
}
