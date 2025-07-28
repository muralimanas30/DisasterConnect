// Sample layout for dashboard route.
// Place dashboard-related data-fetching logic here.
"use client";
/**
 * Dashboard Layout
 * Place dashboard-related data-fetching logic (e.g., fetch dashboard stats, user data) here.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
// import { fetchDashboardStatsThunk } from "../../store/slices/dashboardSlice"; // Uncomment and adjust import as needed

export default function DashboardLayout({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user?.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
        // Example: fetch dashboard stats on mount
        // dispatch(fetchDashboardStatsThunk());
    }, [user, router, dispatch]);

    return <>{children}</>;
}
