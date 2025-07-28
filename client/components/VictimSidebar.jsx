"use client";
/**
 * VictimSidebar
 * Displays victim info/help and FAQ as a card, not as a sidebar/drawer.
 */
export default function VictimSidebar() {
    return (
        <div className="card bg-base-100 shadow-xl w-full max-w-xs mx-auto my-4">
            <div className="card-body">
                <div className="mb-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Victim Info & FAQ</span>
                </div>
                <ul className="list-disc list-inside mb-2 text-base-content/80">
                    <li>Report incidents and add details for volunteers.</li>
                    <li>Once assigned, you can chat with volunteers.</li>
                    <li>Mark your incident as resolved when you are safe.</li>
                    <li>Update your location if needed for accurate help.</li>
                </ul>
                <div className="divider my-2">FAQs</div>
                <div className="collapse collapse-arrow bg-base-200 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        What happens after reporting?
                    </div>
                    <div className="collapse-content">
                        Volunteers will see your incident and may accept to help. You can chat with them once assigned.
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        How do I update my location?
                    </div>
                    <div className="collapse-content">
                        Use the map to verify your location. Contact support if you need to update it.
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        How do I mark as resolved?
                    </div>
                    <div className="collapse-content">
                        When your issue is resolved, click the{" "}
                        <span className="badge badge-success badge-sm">
                            Mark as Resolved
                        </span>{" "}
                        button in your incident card.
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200 mb-2 shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-bold">
                        Need more help?
                    </div>
                    <div className="collapse-content">
                        Contact support or use the chat to communicate with volunteers.
                    </div>
                </div>
            </div>
        </div>
    );
}
                       