import React from 'react'
import Link from "next/link";
import { useSelector } from 'react-redux';

// Utility to calculate distance in meters between two [lng, lat] points
function getDistanceFromUser(incidentCoords, userCoords) {
    if (
        !incidentCoords ||
        !userCoords ||
        incidentCoords.length !== 2 ||
        userCoords.length !== 2 ||
        (incidentCoords[0] === 0 && incidentCoords[1] === 0) ||
        (userCoords[0] === 0 && userCoords[1] === 0)
    ) {
        return null;
    }
    // Haversine formula
    const toRad = (v) => (v * Math.PI) / 180;
    const [lng1, lat1] = incidentCoords;
    const [lng2, lat2] = userCoords;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

export default function IncidentList({ incidents, userLocation }) {
    // Use current volunteer location if available (currentLocation from Redux)
    const { currentLocation } = useSelector(state => state.user.user || {});
    const volunteerLocation =
        currentLocation && Array.isArray(currentLocation.coordinates)
            ? currentLocation
            : userLocation;

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Victims</th>
                        <th>Volunteers</th>
                        <th>Reported</th>
                        {/* <th>Location</th> */}
                        <th>Distance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((inc, idx) => {
                        const distance =
                            volunteerLocation && inc.location?.coordinates
                                ? getDistanceFromUser(inc.location.coordinates, volunteerLocation.coordinates)
                                : null;
                        const rowBg = idx % 2 === 0 ? "bg-base-200" : "bg-base-100";
                        return (
                            <tr key={inc._id} className={`${rowBg} border-b border-base-300`}>
                                <th>{idx + 1}</th>
                                <td className="font-bold">
                                    <Link href={`/incidents/${inc._id}`} className="link link-primary" title="View Details">
                                        {inc.title}
                                    </Link>
                                </td>
                                <td>
                                    <span className={`badge badge-xs ${inc.status === "resolved"
                                        ? "badge-success"
                                        : inc.status === "in_progress"
                                            ? "badge-warning"
                                            : "badge-info"
                                        }`}>
                                        {inc.status.replace("_", " ").toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-outline badge-sm">
                                        {inc.victims?.length || 0}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-outline badge-sm">
                                        {inc.volunteers?.length || 0}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-ghost badge-xs">
                                        {new Date(inc.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                                
                                {/*
                                <td>
                                    <span className="badge badge-outline badge-xs">
                                        [{inc.location?.coordinates?.[0]?.toFixed(2)}, {inc.location?.coordinates?.[1]?.toFixed(2)}]
                                    </span>
                                </td> */}
                                <td>
                                    {distance !== null && (
                                        <span className="badge badge-accent badge-xs ml-1">
                                            {distance} m
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <Link
                                        href={`/incidents/${inc._id}`}
                                        className="btn btn-info btn-xs"
                                        title="View Details"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}