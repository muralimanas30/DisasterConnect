"use client";
/**
 * VolunteerDashboard
 * Shows either the assigned incident or the available incidents table.
 */
import { useSelector } from "react-redux";
import AssignedIncident from "./AssignedIncident";
import AvailableIncidents from "./AvailableIncidents";
import useCurrentLocation from "../hooks/useCurrentLocation";

export default function VolunteerDashboard() {
    const { assignedIncident } = useSelector((state) => state.incidents);
    const { location, error: locationError } = useCurrentLocation();

    return (
        <div className="flex gap-4 justify-center">
            <div className="">
                {assignedIncident
                    ? <AssignedIncident incident={assignedIncident} />
                    : <AvailableIncidents />
                }
                <div className="divider"></div>
            </div>
        </div>
    );
}
           