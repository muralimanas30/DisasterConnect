"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";

// Helper to create a pin-shaped SVG marker icon
function createPinIcon(color) {
    return L.icon({
        iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path d="M16 2C9 2 2 9 2 18c0 10.5 14 28 14 28s14-17.5 14-28C30 9 23 2 16 2z" fill="${color}" stroke="black" stroke-width="2"/><circle cx="16" cy="18" r="6" fill="white" stroke="black" stroke-width="2"/></svg>`,
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -48],
        tooltipAnchor: [0, -48],
        className: "",
    });
}

// Custom marker colors for roles and self
const getMarkerIcon = (role, isSelf = false) => {
    if (isSelf) return createPinIcon("#f43f5e"); // rose for self
    if (role === "victim") return createPinIcon("#22c55e"); // green
    if (role === "volunteer") return createPinIcon("#f59e42"); // orange
    if (role === "incident") return createPinIcon("#2563eb"); // blue
    return createPinIcon("#2563eb"); // default blue
};

export default function IncidentMapClient({ markers = [], center, selfUserId }) {
    if (!center || !center.lat || !center.lng) return null;
    return (
        <div className="w-full h-64 rounded-lg overflow-hidden mb-2">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="w-full h-64"
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {markers.map((m, idx) => (
                    <Marker
                        key={`${m.lat}-${m.lng}-${m.label}-${m.type}-${idx}`}
                        position={[m.lat, m.lng]}
                        icon={getMarkerIcon(m.type, m.userId === selfUserId)}
                        title={m.label}
                        alt={m.label}
                        riseOnHover={true}
                    >
                        {/* Always show label using Tooltip, open by default */}
                        <Tooltip direction="top" offset={[0, -48]} permanent>
                            <span className="font-bold">{m.label}</span>
                        </Tooltip>
                        <Popup>
                            <div className="font-bold">{m.label}</div>
                            <div className="badge badge-outline badge-xs">{m.type}{m.userId === selfUserId ? " (You)" : ""}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
