"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix for missing marker icons in Leaflet
// Removed unnecessary deletion of _getIconUrl as it does not exist on L.Icon.Default
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

interface MapProps {
    incidents: Incident[];
    volunteers: Volunteer[];
}

export default function Map({ incidents, volunteers }: MapProps) {
    useEffect(() => {
        console.log("Incidents:", incidents);
        console.log("Volunteers:", volunteers);
    }, [incidents, volunteers]);

    return (
        <MapContainer
            center={[20, 0]} // Default center of the map
            zoom={2} // Default zoom level
            style={{ height: "500px", width: "100%" }}
        >
            {/* Tile Layer */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Render Incidents */}
            {incidents.map((incident) => (
                <Marker
                    key={incident.id}
                    position={[incident.coordinates.lat, incident.coordinates.lng]}
                    icon={L.divIcon({
                        className: "incident-marker",
                        html: `<div style="background-color: ${incident.type === "Flood" ? "blue" : "red"
                            }; width: 20px; height: 20px; border-radius: 50%;"></div>`,
                    })}
                >
                    <Popup>
                        <strong>{incident.title}</strong>
                        <br />
                        {incident.description}
                    </Popup>
                </Marker>
            ))}

            {/* Render Volunteers */}
            {volunteers.map((volunteer) => (
                <CircleMarker
                    key={volunteer.id}
                    center={[volunteer.coordinates.lat, volunteer.coordinates.lng]}
                    radius={8}
                    color="green" // Volunteer markers are green
                >
                    <Popup>
                        <strong>{volunteer.name}</strong>
                        <br />
                        Assigned to Incident: {volunteer.assignedIncident}
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}