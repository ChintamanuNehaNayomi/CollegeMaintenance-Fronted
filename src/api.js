import { clearAuthentication } from "./auth";

const configuredApiUrl =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://collegemaintenance-backend.onrender.com"
    : "http://localhost:8080");
const API_BASE_URL = configuredApiUrl.trim().replace(/\/+$/, "");

export async function authenticatedFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { ...options, headers });
  const refreshToken = localStorage.getItem("refreshToken");
  if (response.status !== 401 || !refreshToken) {
    return response;
  }

  let refreshResponse;
  try {
    refreshResponse = await fetch(`${API_BASE_URL}/api/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return response;
  }

  const refreshed = await refreshResponse.json().catch(() => ({}));
  if (
    !refreshResponse.ok ||
    !refreshed.accessToken ||
    refreshed.role !== localStorage.getItem("role") ||
    refreshed.username !== localStorage.getItem("username")
  ) {
    clearAuthentication();
    return response;
  }

  localStorage.setItem("accessToken", refreshed.accessToken);
  if (refreshed.refreshToken) {
    localStorage.setItem("refreshToken", refreshed.refreshToken);
  }
  headers.Authorization = `Bearer ${refreshed.accessToken}`;
  return fetch(url, { ...options, headers });
}

export default API_BASE_URL;
