"use client";
/**
 * AssignedIncident
 * Shows details, chat, and map for the volunteer's assigned incident.
 */
import IncidentChat from "./IncidentChat";
import IncidentMap from "./IncidentMap";

export default function AssignedIncident({ incident }) {
    if (!incident) return null;
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
                <IncidentMap lat={incident.location?.coordinates?.[1]} lng={incident.location?.coordinates?.[0]} />
                <IncidentChat incidentId={incident._id} />
                {/* Only victims can mark as resolved, so no MarkResolvedButton here */}
            </div>
        </div>
    );
}