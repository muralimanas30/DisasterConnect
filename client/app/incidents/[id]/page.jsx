"use client";
/**
 * SingleIncidentPage
 * Shows full details for a single incident.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncidentByIdThunk } from "../../../store/slices/incidentSlice";
import { useParams } from "next/navigation";
import Loader from "../../../components/Loader";
import IncidentDetails from "../../../components/IncidentDetails";
import VictimIncidents from "../../../components/VictimIncidents";
import VolunteerSidebar from "../../../components/VolunteerSidebar";
import VictimSidebar from "../../../components/VictimSidebar";

function getDistanceMeters([lon1, lat1], [lon2, lat2]) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function SingleIncidentPage() {
    const dispatch = useDispatch();
    const { incident, loading, error } = useSelector(s => s.incidents);
    const { location: userLocation, currentLocation } = useSelector(state => state.user.user || {});
    const params = useParams();
    const incidentId = params?.id; // Use 'id' from [id] folder

    useEffect(() => {
        if (incidentId) {
            dispatch(fetchIncidentByIdThunk(incidentId));
        }
    }, [incidentId, dispatch]);

    let distance = "-";
    const location =
        currentLocation && Array.isArray(currentLocation.coordinates)
            ? currentLocation
            : userLocation && Array.isArray(userLocation.coordinates)
            ? userLocation
            : null;

    if (
        location &&
        Array.isArray(location.coordinates) &&
        incident?.location?.coordinates
    ) {
        distance = getDistanceMeters(
            location.coordinates,
            incident.location.coordinates
        ).toFixed(0);
    }

    const { user } = useSelector((state) => state.user);

    if (loading)
        return <Loader />;
    if (error)
        return <div className="alert alert-error my-6">{error}</div>;
    if (!incident)
        return <div className="alert alert-info my-6">Incident not found.</div>;

    return (
        <div className="flex gap-6">
            <div className="flex-1">
                {user?.role === "victim"
                    ? <VictimIncidents />
                    : <IncidentDetails incident={incident} distance={distance} location={location} />
                }
            </div>
            <div className="w-80 hidden lg:block">
                {user?.role === "volunteer" && <VolunteerSidebar />}
                {user?.role === "victim" && <VictimSidebar />}
            </div>
        </div>
    );
}
