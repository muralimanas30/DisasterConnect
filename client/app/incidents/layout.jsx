"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import useRouteLoader from "@/hooks/useRouteLoader";
import Loader from "../../components/Loader";
import { fetchAssignedIncidentThunk } from "../../store/slices/incidentSlice";

export default function IncidentsLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user?.user);
    const { assignedIncident, loading: incidentsLoading } = useSelector(state => state.incidents);
    const loading = useRouteLoader(); // Or your relevant loading state

    useEffect(() => {
        // Redirect to login if no user in session storage or Redux state
        if (typeof window !== "undefined" && !user) {
            router.replace("/login");
        } else if (user && user._id) {
            // Only fetch if user._id is defined and not empty
            if (typeof user._id === "string" && user._id.length === 24) {
                dispatch(fetchAssignedIncidentThunk(user._id));
            }
        }
    }, [user, router, dispatch]);

    return (
        <>
            {(loading || incidentsLoading) && <Loader />}
            {/* Optionally show assigned incident info at the top */}
            {assignedIncident && (
                <div className="alert alert-info mb-2">
                    Assigned Incident: <span className="font-bold">{assignedIncident.title}</span>
                </div>
            )}
            {children}
        </>
    );
}
