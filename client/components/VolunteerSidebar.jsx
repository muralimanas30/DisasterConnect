// Sidebar for VolunteerIncidents page with info and FAQ (daisyUI)
"use client";
export default function VolunteerSidebar() {
    return (
        <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body">
                <h3 className="card-title text-base mb-2">Volunteer Info & FAQ</h3>
                <ul className="list-disc list-inside text-base-content/80 mb-2">
                    <li>Click "Accept & Assign" to take responsibility for an incident.</li>
                    <li>You can only be assigned to one open incident at a time.</li>
                    <li>Click "View Details" to see full incident info and location.</li>
                    <li>Contact the victim using the provided details if needed.</li>
                    <li>Mark the incident as resolved when your task is complete.</li>
                </ul>
                <div className="divider my-2">FAQs</div>
                <div className="collapse collapse-arrow bg-base-100 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        What happens after I accept an incident?
                    </div>
                    <div className="collapse-content">
                        <p>
                            You will be assigned to the incident and can coordinate with the victim. The incident will no longer be available to other volunteers.
                        </p>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        Can I see the incident location?
                    </div>
                    <div className="collapse-content">
                        <p>
                            Yes, click "View Details" on any incident to see its location on a map and all related information.
                        </p>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-100 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        How do I mark an incident as resolved?
                    </div>
                    <div className="collapse-content">
                        <p>
                            After helping the victim, go to the incident details page and use the "Mark as Resolved" button.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
