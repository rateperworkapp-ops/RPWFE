import axios from "axios";

const DEFAULT_LOCAL_API_BASE_URL = "http://localhost:5000/api";
const DEFAULT_PRODUCTION_API_BASE_URL = "https://rpwbe.onrender.com/api";

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  const fallbackBaseUrl = import.meta.env.PROD
    ? DEFAULT_PRODUCTION_API_BASE_URL
    : DEFAULT_LOCAL_API_BASE_URL;

  return normalizeBaseUrl(fallbackBaseUrl);
}

const api = axios.create({
  baseURL: resolveApiBaseUrl()
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
