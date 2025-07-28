"use client";
// AdminIncidents: Handles listing and managing all incidents for admins.
import { useSelector } from "react-redux";

export default function AdminIncidents() {
    const { incidents, loading, error } = useSelector((state) => state.incidents);

    if (loading) {
        return <span className="loading loading-spinner loading-lg"></span>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="card bg-base-200 shadow-xl max-w-2xl mx-auto">
                <div className="card-body">
                    <h2 className="card-title">All Incidents (Admin)</h2>
                    <div>
                        <h3 className="font-bold mb-2">Incidents List</h3>
                        <ul className="list">
                            {incidents.map((inc) => (
                                <li className="list-row card card-body mb-2" key={inc._id}>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{inc.title}</span>
                                        <span>{inc.description}</span>
                                        <span className="badge badge-info badge-outline">{inc.status}</span>
                                        {/* TODO: Add admin controls (update/delete) */}
                                    </div>
                                </li>
                            ))}
                            {incidents.length === 0 && <li>No incidents found.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}