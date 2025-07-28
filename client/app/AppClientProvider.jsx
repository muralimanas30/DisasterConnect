"use client";
/**
 * AppClientProvider
 * Handles client-only logic (Redux hydration, etc.)
 */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromStorage } from "../store/userSlice";

// Remove all SSR/client branching and only hydrate on mount
export default function AppClientProvider() {
  const dispatch = useDispatch();
  useEffect(() => {
    // Always run on client, Next.js "use client" ensures this
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    const user = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
    if (token && user) {
      dispatch(setUserFromStorage({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);
  return null;
}
