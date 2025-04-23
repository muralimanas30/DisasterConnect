"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Map from "@/components/Map";
import axios from "axios";

export default function MapPage() {
    interface Incident {
        id: string;
        title: string;
        description: string;
        coordinates: { lat: number; lng: number };
        type: string;
    }

    interface Volunteer {
        id: string;
        name: string;
        coordinates: { lat: number; lng: number };
        assignedIncident: string;
    }

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const selectedIncidentId = searchParams ? searchParams.get("incidentId") : null;

    useEffect(() => {
        async function fetchData() {
            try {
                const incidentsResponse = await axios.get<Incident[]>("/api/incidents");
                const volunteersResponse = await axios.get<Volunteer[]>("/api/volunteers");

                const incidentsData = incidentsResponse.data;
                const volunteersData = volunteersResponse.data;

                setIncidents(incidentsData);
                setVolunteers(volunteersData);

                // Filter data based on selected incident
                if (selectedIncidentId) {
                    setFilteredIncidents(
                        incidentsData.filter((incident) => incident.id === selectedIncidentId)
                    );
                    setFilteredVolunteers(
                        volunteersData.filter(
                            (volunteer) => volunteer.assignedIncident === selectedIncidentId
                        )
                    );
                } else {
                    setFilteredIncidents(incidentsData);
                    setFilteredVolunteers(volunteersData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedIncidentId]);

    return (
        <div className="p-6 pt-0">
            <h1 className="text-2xl font-bold mb-4">Disaster Map</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading map data...</p>
            ) : filteredIncidents.length === 0 ? (
                <p className="text-center text-gray-500">No incidents currently available.</p>
            ) : (
                <Map incidents={filteredIncidents} volunteers={filteredVolunteers} />
            )}
        </div>
    );
}