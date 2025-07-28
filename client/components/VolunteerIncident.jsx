"use client";
/**
 * VolunteerIncident
 * Shows details and actions for a volunteer's assigned incident.
 */
import React from "react";

export default function VolunteerIncident({ incident }) {
    return (
        <div className="card bg-base-200 shadow-xl my-6">
            <div className="card-body">
                <h2 className="card-title text-2xl">{incident.title}</h2>
                <div className="mb-2">
                    <span className="badge badge-info">{incident.status}</span>
                    <span className="badge badge-ghost ml-2">
                        {new Date(incident.createdAt).toLocaleString()}
                    </span>
                </div>
                <p className="mb-4">{incident.description}</p>
                {/* Victims */}
                <div className="mb-2">
                    <h3 className="font-bold">Victims:</h3>
                    <ul>
                        {incident.victims?.map(v => (
                            <li key={v._id || `victim-${v.name || v}`} className="badge badge-outline badge-sm mr-1">
                                {v.name || v}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Volunteers */}
                <div className="mb-2">
                    <h3 className="font-bold">Volunteers:</h3>
                    <ul>
                        {incident.volunteers?.map(v => (
                            <li key={v._id || `volunteer-${v.name || v}`} className="badge badge-outline badge-sm mr-1">
                                {v.name || v}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Reports */}
                <div className="mb-2">
                    <h3 className="font-bold">Reports:</h3>
                    <ul>
                        {incident.reports?.map((r, idx) => (
                            <li key={r._id || `report-${idx}`} className="mb-1">
                                <span className="badge badge-info">{r.message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    {/* TODO: Add buttons for chat, map, update location, mark resolved, etc. */}
                </div>
            </div>
        </div>
    );
}
