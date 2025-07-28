"use client";
// Incident Chat Page: Displays real-time group chat for a specific incident.

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import IncidentChat from "../../../../components/IncidentChat";

export default function IncidentChatPage() {
    const { id: incidentId } = useParams();
    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.user.token);

    // Defensive: Only render chat if user and token exist
    if (!user || !token || !incidentId) {
        return (
            <div className="alert alert-error mt-8 max-w-xl mx-auto">
                Please log in and select a valid incident to access chat.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <IncidentChat incidentId={incidentId} user={user} token={token} />
        </div>
    );
}
