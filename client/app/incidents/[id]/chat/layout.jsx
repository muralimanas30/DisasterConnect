"use client";
/**
 * Incident Chat Layout
 * Wraps the chat page, fetches incident details and chat messages.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncidentByIdThunk, fetchIncidentChatThunk } from '../../../../store/slices/incidentSlice.js'
import { useParams } from "next/navigation";

export default function IncidentChatLayout({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user?.user);
    const { id: incidentId } = useParams();

    useEffect(() => {
        // Fetch incident details and chat messages when chat page loads
        if (incidentId && user) {
            dispatch(fetchIncidentByIdThunk(incidentId));
            dispatch(fetchIncidentChatThunk(incidentId));
        }
    }, [dispatch, incidentId, user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
            <div className="card w-full max-w-2xl shadow-lg bg-base-200 p-4">
                {children}
            </div>
        </div>
    );
}
