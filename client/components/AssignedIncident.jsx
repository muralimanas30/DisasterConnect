"use client";
/**
 * AssignedIncident
 * Shows details, chat, and map for the volunteer's assigned incident.
 */
import AlertTasks from "./AlertTasks";
import IncidentChat from "./IncidentChat";
import { useSelector } from "react-redux";

export default function AssignedIncident({ incident }) {
    if (!incident) return null;
    const { user } = useSelector((state) => state.user);
    const token = useSelector((state) => state.user.token);

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
                {/* Replace map with AlertTasks for volunteers */}
                {user?.role === "volunteer" && (
                    <AlertTasks incidentId={incident._id} token={token} />
                )}
                <IncidentChat incidentId={incident._id} />
            </div>
        </div>
    );
}