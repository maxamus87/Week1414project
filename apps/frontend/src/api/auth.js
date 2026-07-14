import { apiRequest } from "./client.js";

export function registerUser({ email, password, name }) {
  return apiRequest("/auth/register", { method: "POST", body: { email, password, name } });
}

export function loginUser({ email, password }) {
  return apiRequest("/auth/login", { method: "POST", body: { email, password } });
}

export function fetchCurrentUser(token) {
  return apiRequest("/auth/me", { token });
}
