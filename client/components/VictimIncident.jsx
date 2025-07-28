"use client";
/**
 * VictimIncident
 * Shows all details, reports, and actions for a victim's incident.
 * Sidebar: incident report form.
 * Below: available incidents (with join action).
 */
import React, { useState } from "react";
import IncidentReportForm from "./IncidentReportForm";
import AvailableIncidents from "./AvailableIncidents";
import { useSelector } from "react-redux";

export default function VictimIncident({ incident }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const { assignedIncident } = useSelector(s => s.incidents);
    // Handler to refresh AvailableIncidents after joining
    const handleJoinIncident = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Get victim names
    const victimNames = incident.victims?.map(v => v.name || v._id || v) || [];
    const volunteerNames = incident.volunteers?.map(v => v.name || v._id || v) || [];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main card */}
                <div className="flex-1">
                    <div className="card bg-base-200 shadow-xl my-6">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{incident.title}</h2>
                            <div className="mb-2 flex gap-2 flex-wrap">
                                <span className="badge badge-info">{incident.status}</span>
                                <span className="badge badge-ghost">{new Date(incident.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="mb-2">{incident.description}</p>
                            <div className="collapse collapse-arrow bg-base-100 my-2">
                                <input type="checkbox" />
                                <div className="collapse-title font-bold">Victims</div>
                                <div className="collapse-content">
                                    <ul className="flex flex-wrap gap-2">
                                        {victimNames.length > 0 ? (
                                            victimNames.map((name, idx) => (
                                                <li key={`victim-${name}-${idx}`} className="badge badge-outline badge-sm">{name}</li>
                                            ))
                                        ) : (
                                            <span className="badge badge-outline">None</span>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-100 my-2">
                                <input type="checkbox" />
                                <div className="collapse-title font-bold">Volunteers</div>
                                <div className="collapse-content">
                                    <ul className="flex flex-wrap gap-2">
                                        {volunteerNames.length > 0 ? (
                                            volunteerNames.map((name, idx) => (
                                                <li key={`volunteer-${name}-${idx}`} className="badge badge-outline badge-sm">{name}</li>
                                            ))
                                        ) : (
                                            <span className="badge badge-outline">None</span>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-100 my-2">
                                <input type="checkbox" />
                                <div className="collapse-title font-bold">Reports</div>
                                <div className="collapse-content">
                                    {incident.reports?.length > 0 ? (
                                        <ul className="flex flex-col gap-2">
                                            {incident.reports.map((r, idx) => (
                                                <li key={r._id || `report-${idx}`} className="card bg-base-300 p-2">
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
                        </div>
                    </div>
                </div>
                {/* Sidebar: Incident Report Form & Help/Info */}
                {!assignedIncident && (
                    <aside className="w-full lg:w-80">
                        <IncidentReportForm incidentId={incident._id} />
                        <div className="card bg-base-100 shadow-xl mt-6">
                            <div className="card-body">
                                <h3 className="card-title text-lg mb-2">Victim Help & Info</h3>
                                <div className="collapse collapse-arrow bg-base-200 mb-2">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-bold">What happens after reporting?</div>
                                    <div className="collapse-content text-base">
                                        Volunteers will see your incident and may accept to help. You can chat with them once assigned.
                                    </div>
                                </div>
                                <div className="collapse collapse-arrow bg-base-200 mb-2">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-bold">How do I update my location?</div>
                                    <div className="collapse-content text-base">
                                        Use the map to verify your location. Contact support if you need to update it.
                                    </div>
                                </div>
                                <div className="collapse collapse-arrow bg-base-200 mb-2">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-bold">How do I mark as resolved?</div>
                                    <div className="collapse-content text-base">
                                        <div className="flex flex-col gap-2">
                                            <span>
                                                <span className="badge badge-success badge-lg mb-2">Resolved</span>
                                                <span className="ml-2">
                                                    When your issue is resolved, click the <span className="badge badge-success badge-sm">Mark as Resolved</span> button in your incident card.
                                                </span>
                                            </span>
                                            <span>
                                                <span className="badge badge-outline badge-info">Note:</span>
                                                <span className="ml-2">
                                                    Once resolved, you will be removed from the incident and volunteers will be notified.
                                                </span>
                                            </span>
                                            <span>
                                                <span className="badge badge-outline badge-warning">Tip:</span>
                                                <span className="ml-2">
                                                    If all victims resolve, the incident will be closed automatically.
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="collapse collapse-arrow bg-base-200 mb-2">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-bold">Need more help?</div>
                                    <div className="collapse-content text-base">
                                        Contact support or use the chat to communicate with volunteers.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
            {/* Below: Available Incidents */}
            {!assignedIncident && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Available Incidents</h3>
                    <AvailableIncidents key={refreshKey} onJoinIncident={handleJoinIncident} />
                </div>
            )}
        </div>
    );
}
