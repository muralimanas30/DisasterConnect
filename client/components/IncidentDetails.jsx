"use client";

/**
 * IncidentDetails
 * Shows full details for a single incident, with improved styling and map.
 * Allows volunteer to accept/assign the incident, with sidebar card and accordion.
 */
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignVolunteerThunk, clearIncidentStatus, resetIncidentState, updateIncidentStatusThunk } from "../store/slices/incidentSlice";
import IncidentChat from "./IncidentChat";
import { useRouter } from "next/navigation";
const IncidentMap = dynamic(() => import("./IncidentMap"), { ssr: false });

export default function IncidentDetails({ incident, distance, location }) {
    if (!incident) return null;
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector(state => state.user);
    const { assignedIncident, loading, success, error } = useSelector(state => state.incidents);

    // Always get the latest user location from Redux (currentLocation preferred)
    const { location: userLocation, currentLocation } = user || {};
    const effectiveLocation =
        currentLocation && Array.isArray(currentLocation.coordinates)
            ? currentLocation
            : userLocation && Array.isArray(userLocation.coordinates)
            ? userLocation
            : null;

    // Compute distance dynamically if not provided as prop
    function getDistanceMeters([lon1, lat1], [lon2, lat2]) {
        const toRad = deg => deg * Math.PI / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    let computedDistance = "-";
    if (
        effectiveLocation &&
        Array.isArray(effectiveLocation.coordinates) &&
        incident?.location?.coordinates &&
        Array.isArray(incident.location.coordinates)
    ) {
        // Defensive: both must be [lng, lat] arrays of length 2
        if (
            effectiveLocation.coordinates.length === 2 &&
            incident.location.coordinates.length === 2 &&
            typeof effectiveLocation.coordinates[0] === "number" &&
            typeof effectiveLocation.coordinates[1] === "number" &&
            typeof incident.location.coordinates[0] === "number" &&
            typeof incident.location.coordinates[1] === "number"
        ) {
            computedDistance = getDistanceMeters(
                effectiveLocation.coordinates,
                incident.location.coordinates
            ).toFixed(0);
        }
    }

    // Accept/Assign incident handler
    const handleAcceptIncident = () => {
        dispatch(assignVolunteerThunk(incident._id));
    };

    // Mark as resolved handler
    const handleMarkResolved = async () => {
        await dispatch(updateIncidentStatusThunk({ incidentId: incident._id, status: "resolved" }));
        // Ensure Redux state is refreshed
        dispatch(resetIncidentState());
        // Route to dashboard after resolving
        router.push("/dashboard");
    };

    // Show accept button only for volunteers who are not assigned to this incident
    const canAccept =
        user?.role === "volunteer" &&
        (!assignedIncident || assignedIncident._id !== incident._id) &&
        incident.status !== "resolved";

    // Clear status after showing success/error
    const handleCloseAlert = () => {
        dispatch(clearIncidentStatus());
    };

    // Is this the assigned incident for the volunteer?
    const isVolunteerAssigned =
        user?.role === "volunteer" &&
        assignedIncident &&
        assignedIncident._id === incident._id;

    // Only victims can mark as resolved
    const canMarkResolved = user?.role === "victim" &&
        incident.victims?.some(v => (v._id || v) === user._id) &&
        incident.status !== "resolved";

    return (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <div className="card bg-base-200 shadow-xl my-6">
                    <div className="card-body">
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                            <span className="badge badge-info">{incident.status}</span>
                            <span className="badge badge-ghost">{new Date(incident.createdAt).toLocaleString()}</span>
                            <span className="badge badge-outline">
                                Distance: {computedDistance} m
                            </span>
                        </div>
                        <h2 className="card-title text-xl">{incident.title}</h2>
                        <div className="mb-2">{incident.description}</div>
                        <div className="collapse collapse-arrow bg-base-200 my-2">
                            <input type="checkbox" />
                            <div className="collapse-title font-bold">Victims</div>
                            <div className="collapse-content">
                                <ul className="flex flex-wrap gap-2">
                                    {incident.victims?.length > 0 ? (
                                        incident.victims.map((v,rand) => (
                                            <li key={rand} className="badge badge-outline badge-sm">
                                                {v.name || v._id || v}
                                            </li>
                                        ))
                                    ) : (
                                        <span className="badge badge-outline">None</span>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200 my-2">
                            <input type="checkbox" />
                            <div className="collapse-title font-bold">Volunteers</div>
                            <div className="collapse-content">
                                <ul className="flex flex-wrap gap-2">
                                    {incident.volunteers?.length > 0 ? (
                                        incident.volunteers.map(v => (
                                            <li key={v._id || `volunteer-${v.name || v}`} className="badge badge-outline badge-sm">
                                                {v.name || v._id || v}
                                            </li>
                                        ))
                                    ) : (
                                        <span className="badge badge-outline">None</span>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200 my-2">
                            <input type="checkbox" />
                            <div className="collapse-title font-bold">Reports</div>
                            <div className="collapse-content">
                                {incident.reports?.length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {incident.reports.map((r, idx) => (
                                            <li key={idx} className="card bg-base-300 p-2">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-mono text-gray-500">
                                                        {new Date(r.createdAt).toLocaleDateString()}{" "}
                                                        {new Date(r.createdAt).toLocaleTimeString()}
                                                    </span>
                                                    <span className="mt-1">{r.message || r.text}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="badge badge-outline">No reports yet.</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-bold mb-1">Location:</h3>
                            {incident.location?.coordinates ? (
                                <div className="mb-2">
                                    <IncidentMap lat={incident.location.coordinates[1]} lng={incident.location.coordinates[0]} />
                                    <div className="text-sm mt-2">
                                        <span className="badge badge-outline">
                                            {incident.location.coordinates[1]}, {incident.location.coordinates[0]}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="badge badge-outline">Unknown</span>
                            )}
                        </div>
                        {/* Show chat if assigned volunteer or victim */}
                        {/* Only victims can mark as resolved */}
                        {canMarkResolved && (
                            <button
                                className="btn btn-success btn-sm mt-4"
                                onClick={handleMarkResolved}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Mark as Resolved"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Accept & Assign Sidebar Card: only show if not assigned */}
            {!isVolunteerAssigned && user?.role === "volunteer" && (
                <div className="w-full lg:w-80">
                    <div className="card bg-base-100 shadow-xl my-6">
                        <div className="card-body">
                            <h3 className="card-title text-lg mb-2">Accept & Assign</h3>
                            <button
                                className="btn btn-success btn-block mb-2"
                                onClick={() => dispatch(assignVolunteerThunk(incident._id))}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Accept & Assign"
                                )}
                            </button>
                            {success && (
                                <div className="alert alert-success mb-2">
                                    {success}
                                    <button className="btn btn-xs btn-ghost ml-2" onClick={handleCloseAlert}>Close</button>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-error mb-2">
                                    {error}
                                    <button className="btn btn-xs btn-ghost ml-2" onClick={handleCloseAlert}>Close</button>
                                </div>
                            )}
                            <div className="collapse collapse-arrow bg-base-200 mt-2">
                                <input type="checkbox" />
                                <div className="collapse-title font-bold">What happens if you accept?</div>
                                <div className="collapse-content text-base">
                                    <ul className="list-disc ml-4">
                                        <li>You will be assigned to this incident and responsible for assisting the victim(s).</li>
                                        <li>The incident will be marked as <span className="badge badge-info">active</span> and unavailable to other volunteers.</li>
                                        <li>You can chat with victims and other volunteers.</li>
                                        <li>Once resolved, mark the incident as <span className="badge badge-success">resolved</span> in the details page.</li>
                                        <li>You can only be assigned to one open incident at a time.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}