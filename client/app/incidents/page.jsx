"use client";
import { useSelector, useDispatch } from "react-redux";
import VolunteerDashboard from "../../components/VolunteerDashboard";
import IncidentReportForm from "../../components/IncidentReportForm";
import AvailableIncidents from "../../components/AvailableIncidents";
import VictimIncident from "../../components/VictimIncident";
import IncidentMap from "../../components/IncidentMap";
import { updateIncidentStatusThunk, getAllIncidentsThunk } from "../../store/slices/incidentSlice";
import VictimIncidents from "../../components/VictimIncidents";
import VolunteerSidebar from "../../components/VolunteerSidebar";
import VictimSidebar from "../../components/VictimSidebar";

/**
 * Incidents Page
 * Delegates role-based UI and logic to dedicated components.
 * Improved styling and map usage for victim flow.
 */
export default function IncidentsPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.user);
    const { loading, error, incidents, success } = useSelector(s => s.incidents);

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="card bg-base-200 shadow-xl p-8 max-w-md w-full">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-2">Login Required</h2>
                        <div className="alert alert-warning">Please login to view incidents.</div>
                    </div>
                </div>
            </div>
        );
    }

    // Volunteer logic
    if (user.role === "volunteer") {
        return (
            <div className="flex gap-6">
                <div className="flex-1">
                    <VolunteerDashboard />
                </div>
                <div className="w-80 hidden lg:block">
                    <VolunteerSidebar />
                </div>
            </div>
        );
    }

    // Victim logic
    if (user.role === "victim") {
        return (
            <div className="flex gap-6">
                <div className="flex-1">
                    <VictimIncidents />
                </div>
                
            </div>
        );
    }

    // Admin logic (reuse existing component)
    if (user.role === "admin") {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="card bg-base-200 shadow-xl p-8 max-w-md w-full">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-2">Admin Incidents</h2>
                        <div className="alert alert-info">Admin incidents view coming soon.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[40vh]">
            <div className="card bg-base-200 shadow-xl p-8 max-w-md w-full">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-2">No Incidents</h2>
                    <div className="alert alert-info">No incidents available for your role.</div>
                </div>
            </div>
        </div>
    );
}

// In your incident report form:
// <SubmitButton loading={loading} disabled={formInvalid}>
//     Report Incident
// </SubmitButton>