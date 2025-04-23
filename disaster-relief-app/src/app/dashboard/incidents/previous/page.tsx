"use client";

import { useSelector } from "react-redux";

export default function PreviousReportsPage() {
    const prevIncidents = useSelector((store: any) => store.user.prevIncidents); // Get previous incidents from Redux store

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Previous Reports</h1>
            {prevIncidents && prevIncidents.length > 0 ? (
                <ul className="space-y-4">
                    {prevIncidents.map((incident: any) => (
                        <li key={incident.id} className="p-4 border rounded shadow">
                            <h2 className="text-lg font-semibold">{incident.title}</h2>
                            <p className="text-gray-600">{incident.description}</p>
                            <p className="text-sm text-gray-500">
                                Reported on: {new Date(incident.createdAt).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You have no previous reports.</p>
            )}
        </div>
    );
}