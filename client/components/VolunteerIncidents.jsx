"use client";
/**
 * VolunteerIncidents
 * Shows a table of available incidents for volunteers, with improved row styling, help modal, and accordion.
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchAvailableIncidentsThunk } from "../store/slices/incidentSlice";
import useCurrentLocation from "../hooks/useCurrentLocation";

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

export default function VolunteerIncidents() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector(state => state.user);
    const { incidents, loading, error } = useSelector(state => state.incidents);
    const { location } = useCurrentLocation();
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchAvailableIncidentsThunk(user._id));
        }
    }, [user?._id, dispatch]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    if (error)
        return (
            <div className="alert alert-error my-6">{error}</div>
        );
    if (!incidents || incidents.length === 0)
        return (
            <div className="alert alert-info my-6">No available incidents to join.</div>
        );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Available Incidents</h1>
                <button className="btn btn-info btn-sm" onClick={() => setShowHelp(true)}>
                    Help
                </button>
            </div>
            {/* Help Modal */}
            {showHelp && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-2">How to Join an Incident</h3>
                        <ul className="list-disc ml-4 mb-2 text-base">
                            <li>Review the incident details, distance, and status.</li>
                            <li>Click <span className="badge badge-primary">View</span> to see full details.</li>
                            <li>Use the <span className="badge badge-info">Join</span> button on the details page to volunteer.</li>
                            <li>Contact victims or other volunteers using the chat feature.</li>
                        </ul>
                        <div className="modal-action">
                            <button className="btn btn-sm btn-primary" onClick={() => setShowHelp(false)}>Close</button>
                        </div>
                    </div>
                </dialog>
            )}
            {/* Extra Info Accordion */}
            <div className="collapse collapse-arrow bg-base-100 mb-4">
                <input type="checkbox" />
                <div className="collapse-title font-bold">
                    What do the columns mean?
                </div>
                <div className="collapse-content text-base">
                    <ul className="list-disc ml-4">
                        <li><span className="badge badge-info">Status</span>: Current state of the incident.</li>
                        <li><span className="badge badge-outline">Distance</span>: How far the incident is from your location (in meters).</li>
                        <li><span className="badge badge-outline badge-info">Victims</span>: Number of people affected.</li>
                        <li><span className="badge badge-outline badge-success">Volunteers</span>: Number of volunteers assigned.</li>
                        <li><span className="badge badge-primary">View</span>: See full details and join.</li>
                    </ul>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date/Time</th>
                            <th>Distance (m)</th>
                            <th>
                                <span className="badge badge-outline badge-info">Victims</span>
                            </th>
                            <th>
                                <span className="badge badge-outline badge-success">Volunteers</span>
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(incident => {
                            let distance = "-";
                            if (
                                location &&
                                Array.isArray(location.coordinates) &&
                                incident.location?.coordinates
                            ) {
                                distance = getDistanceMeters(
                                    location.coordinates,
                                    incident.location.coordinates
                                ).toFixed(0);
                            }
                            return (
                                <tr key={incident._id} className="hover:bg-base-200 cursor-pointer">
                                    <td className="font-semibold">{incident.title}</td>
                                    <td>
                                        <span className="badge badge-info">{incident.status}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost">
                                            {new Date(incident.createdAt).toLocaleString()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">{distance}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline badge-info">
                                            {incident.victims?.length ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline badge-success">
                                            {incident.volunteers?.length ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={e => {
                                                e.stopPropagation();
                                                router.push(`/incidents/${incident._id}`);
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}