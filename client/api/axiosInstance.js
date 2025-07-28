import axios from "axios";
import { BACKEND_API_URL } from "../lib/constants";
import extractError from "../lib/extractError";

// Simple token getter (can be replaced with context or cookies)
function getToken() {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem("token");
    }
    return null;
}

const axiosInstance = axios.create({
    baseURL: BACKEND_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach Bearer token if available
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("token");
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
        const isAuthRequest =
            error?.config?.url?.includes("/login") ||
            error?.config?.url?.includes("/register");
        // Only logout if 401/403 and not an auth request
        if (
            (error?.response?.status === 401 || error?.response?.status === 403) &&
            token &&
            !isAuthRequest
        ) {
            import("../store").then(({ default: store }) => {
                import("../store/userSlice").then(({ logout }) => {
                    store.dispatch(logout());
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                });
            });
        }
        // Log error for debugging
        console.error("[axiosInstance] API error:", extractError(error));
        return Promise.reject(error);
    }
);

export default axiosInstance;
