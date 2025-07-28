"use client";
/**
 * VictimIncidents
 * Responsive, stylish layout for victim incident details and actions.
 * Sidebar: VictimSidebar with help/info.
 * If no assigned incident, show report form and available incidents.
 */
import { useSelector } from "react-redux";
import VictimSidebar from "./VictimSidebar";
import IncidentDetails from "./IncidentDetails";
import IncidentReportForm from "./IncidentReportForm";
import AvailableIncidents from "./AvailableIncidents";

export default function VictimIncidents() {
    const { assignedIncident } = useSelector((state) => state.incidents);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full px-2 md:px-6 py-6">
            <div className="flex-1 max-w-3xl w-full">
                <div className="bg-base-200 rounded-2xl shadow-2xl p-6 mb-8">
                    {assignedIncident ? (
                        <IncidentDetails incident={assignedIncident} />
                    ) : (
                        <>
                            <IncidentReportForm />
                            <div className="divider my-6"></div>
                            <AvailableIncidents />
                        </>
                    )}
                </div>
            </div>
            {/* Animated vertical divider for large screens */}
            <div className="hidden lg:flex flex-col items-center mx-2">
                <div className="h-[340px] w-2">
                    <span className="block h-full w-1 rounded-full bg-gradient-to-b from-base-300 via-base-200 to-base-100 animate-pulse"></span>
                </div>
            </div>
            {/* Sidebar */}
            <div className="w-full lg:w-80 mt-4 lg:mt-0">
                <VictimSidebar />
            </div>
        </div>
    );
}