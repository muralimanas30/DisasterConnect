"use client";
/**
 * Incident Map Page
 * Shows live map for the incident with all victims/volunteers.
 * Location sockets run automatically and update every 5 seconds while logged in.
 */
import { useSelector } from "react-redux";
import IncidentMap from "../../../../components/IncidentMap";
import React from "react";

export default function IncidentMapPage({ params }) {
    // Unwrap params for future Next.js compatibility
    const unwrappedParams = React.use(params);
    const incidentId = unwrappedParams?.id || params.id;
    const { user, token } = useSelector((state) => state.user);

    // IncidentMap handles socket connection and live location updates (background)
    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Live Incident Map</h2>
            <IncidentMap incidentId={incidentId} token={token} />
            <div className="mt-4">
                <span className="badge badge-info">
                    Your location is shared in real time while you are logged in.
                </span>
            </div>
        </div>
    );
}
