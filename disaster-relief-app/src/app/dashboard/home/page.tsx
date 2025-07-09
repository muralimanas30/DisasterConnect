"use client";

import Link from "next/link";
import React from 'react'
const HomePage = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">Welcome to the DRCP Dashboard</h1>
            <p className="text-center text-gray-600">
                Your one-stop platform for managing disaster relief efforts efficiently.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature: Report an Incident */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Report an Incident</h2>
                        <p>
                            Quickly report disasters such as floods, earthquakes, or other emergencies to help coordinate relief efforts.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/dashboard/incidents/report">
                                <button className="btn btn-primary">Report Now</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature: View Previous Reports */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Previous Reports</h2>
                        <p>
                            View a list of incidents you’ve reported in the past and track their status.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/dashboard/incidents/previous">
                                <button className="btn btn-primary">View Reports</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature: Volunteer Management */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Volunteer Management</h2>
                        <p>
                            Manage and view volunteers assigned to disaster relief efforts in your area.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/dashboard/volunteers">
                                <button className="btn btn-primary">Manage Volunteers</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature: Incident Map */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Incident Map</h2>
                        <p>
                            Visualize ongoing incidents and relief efforts on an interactive map.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/dashboard/map">
                                <button className="btn btn-primary">View Map</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature: Announcements */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Announcements</h2>
                        <p>
                            Stay updated with the latest announcements and updates from the disaster relief team.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/dashboard/announcements">
                                <button className="btn btn-primary">View Announcements</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature: User Profile */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">User Profile</h2>
                        <p>
                            Manage your account details and view your activity history on the platform.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/dashboard/profile">
                                <button className="btn btn-primary">Go to Profile</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="text-center text-gray-500 mt-8">
                <p>&copy; 2025 Disaster Relief Coordination Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}
export default HomePage