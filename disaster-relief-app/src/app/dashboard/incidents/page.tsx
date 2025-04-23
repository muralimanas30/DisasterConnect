"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/lib/slice/userSlice";

export default function IncidentsPage() {
    interface Incident {
        id: string;
        title: string;
        description: string;
    }

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch incidents on component mount
    useEffect(() => {
        async function fetchIncidents() {
            try {
                const response = await axios.get("/api/incidents");
                const incidents = response.data as Incident[]; // Explicitly cast response data to Incident[]
                setIncidents(incidents);
            } catch (error) {
                console.error("Error fetching incidents:", error);
                setError("Failed to load incidents. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchIncidents();
    }, []);



    const handleSelectIncident = (incidentId: string) => {
        router.push(`/dashboard/map?incidentId=${incidentId}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Incidents</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading incidents...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : incidents.length === 0 ? (
                <p className="text-center text-gray-500">No incidents currently available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {incidents.map((incident: any) => (
                        <div key={incident.id} className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h2 className="card-title">{incident.title}</h2>
                                <p>{incident.description}</p>
                                <div className="card-actions justify-end">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSelectIncident(incident.id)}
                                    >
                                        View on Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}