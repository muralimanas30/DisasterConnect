"use client";
/**
 * AvailableIncidents
 * Shows a table of available incidents for volunteers and victims.
 * Victims see title, description, location, distance, and can join.
 * Volunteers see actions to accept/assign.
 */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { fetchAvailableIncidentsThunk } from "../store/slices/incidentSlice";
import { addVictimToIncident } from "../api/incident";
import { assignVolunteerThunk } from "../store/slices/incidentSlice";
import Pagination from "./Pagination";

function getDistance(coords1, coords2) {
    if (!coords1 || !coords2 || coords1.length !== 2 || coords2.length !== 2) return null;
    const toRad = v => (v * Math.PI) / 180;
    const [lng1, lat1] = coords1;
    const [lng2, lat2] = coords2;
    const R = 6371000;
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

export default function AvailableIncidents({ onJoinIncident }) {
    const dispatch = useDispatch();
    const { incidents, loading, pagination } = useSelector((state) => state.incidents);
    const { location: userLocation } = useCurrentLocation();
    const { user } = useSelector((state) => state.user);

    // Local state for join feedback
    const [joinStatus, setJoinStatus] = useState({ success: null, error: null });
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAvailableIncidentsThunk({ page, limit: 10 }));
    }, [dispatch, page]);

    // Handler for victim joining an incident (using correct backend route)
    const handleJoinIncident = async (incidentId) => {
        setJoinStatus({ success: null, error: null });
        try {
            await addVictimToIncident(incidentId, user._id);
            setJoinStatus({ success: "You have joined the incident!", error: null });
            dispatch(fetchAvailableIncidentsThunk());
            if (typeof onJoinIncident === "function") onJoinIncident();
        } catch (err) {
            setJoinStatus({ success: null, error: err.message });
        }
    };

    // Handler for volunteer accepting/assigning incident
    const handleAcceptIncident = (incidentId) => {
        dispatch(assignVolunteerThunk(incidentId));
    };

    const formatCoords = coords =>
        Array.isArray(coords)
            ? `${coords[1]?.toFixed(4)}, ${coords[0]?.toFixed(4)}`
            : "Unknown";

    return (
        <div className="my-2 flex justify-center">
            <div className="card bg-base-200 shadow-xl w-full max-w-4xl">
                <div className="card-body">
                    <h2 className="card-title text-xl font-bold mb-4">Available Incidents</h2>
                    {joinStatus.error && (
                        <div className="alert alert-error mb-2">{joinStatus.error}</div>
                    )}
                    {joinStatus.success && (
                        <div className="alert alert-success mb-2">{joinStatus.success}</div>
                    )}
                    {loading && (
                        <div className="flex justify-center items-center min-h-[20vh]">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Distance</th>
                                <th>Status</th>
                                <th>Victims</th>
                                <th>Volunteers</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => {
                                const coords = incident.location?.coordinates;
                                const distance =
                                    userLocation && coords
                                        ? getDistance(coords, userLocation.coordinates)
                                        : null;
                                const victimCount = incident.victims?.length || 0;
                                const volunteerCount = incident.volunteers?.length || 0;
                                const isVolunteerAssigned = user?.role === "volunteer" &&
                                    incident.volunteers?.some(v => (v._id || v) === user._id);

                                return (
                                    <tr key={incident._id}>
                                        <td>{incident.title}</td>
                                        <td>{incident.description}</td>
                                        <td>{coords ? formatCoords(coords) : "Unknown"}</td>
                                        <td>
                                            {distance !== null
                                                ? <span className="badge badge-accent">{distance} m</span>
                                                : <span className="badge badge-outline">-</span>}
                                        </td>
                                        <td>
                                            <span className="badge badge-info">{incident.status}</span>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">{victimCount}</span>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">{volunteerCount}</span>
                                        </td>
                                        <td>
                                            {user?.role === "victim" &&
                                                !incident.victims?.some((v) => (v._id || v) === user._id) && (
                                                    <button
                                                        className="btn btn-primary btn-sm cursor-pointer"
                                                        onClick={() => handleJoinIncident(incident._id)}
                                                    >
                                                        Join
                                                    </button>
                                                )}
                                            {user?.role === "volunteer" &&
                                                !isVolunteerAssigned &&
                                                incident.status !== "resolved" && (
                                                    <button
                                                        className="btn btn-success btn-xs cursor-pointer"
                                                        onClick={() => handleAcceptIncident(incident._id)}
                                                    >
                                                        Accept
                                                    </button>
                                                )}
                                            {/* ...existing actions for other roles... */}
                                        </td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                    {(pagination && pagination.totalPages > 0) ? (
                        <Pagination pagination={pagination} onPageChange={setPage} />
                    ) : (
                        <div className="text-center my-4">
                            <span className="badge badge-outline">No incidens available.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}