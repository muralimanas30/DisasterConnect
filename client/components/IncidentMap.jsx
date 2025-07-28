"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSocket from "../hooks/useSocket";
import { updateLiveLocation, fetchIncidentLocationsThunk } from "../store/slices/incidentSlice";

// Dynamically import the map component to avoid SSR errors with leaflet/react-leaflet
const IncidentMapClient = dynamic(() => import("./IncidentMapClient"), { ssr: false });

/**
 * IncidentMap
 * If lat/lng props are provided, show static incident-reported location.
 * If incidentId is provided, show live map with all user locations (for /incidents/[id]/map).
 * Only one map is rendered per invocation.
 */
export default function IncidentMap({ incidentId, token, lat, lng }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { assignedIncident, liveLocations } = useSelector((state) => state.incidents);

    // If lat/lng are provided, render static map for incident-reported location
    if (lat && lng) {
        return (
            <IncidentMapClient
                markers={[{ lat, lng, label: "Reported Location", type: "incident" }]}
                center={{ lat, lng }}
                selfUserId={user?._id}
            />
        );
    }

    // Otherwise, render live map for incidentId (multi-user)
    token = token || useSelector((state) => state.user.token);
    const socketRef = useSocket(token, incidentId);

    // Fetch initial locations from backend
    useEffect(() => {
        if (incidentId) dispatch(fetchIncidentLocationsThunk(incidentId));
    }, [incidentId, dispatch]);

    // Emit user's location every 5 seconds
    useEffect(() => {
        if (!socketRef.current || !incidentId || !user?.currentLocation) return;
        const interval = setInterval(() => {
            // This is the payload sent via socket for user location:
            // {
            //   userId: user._id,
            //   incidentId,
            //   location: user.currentLocation,
            //   name: user.name,
            //   role: user.role,
            // }
            socketRef.current.emit("updateLocation", {
                userId: user._id,
                incidentId,
                location: user.currentLocation,
                name: user.name,
                role: user.role,
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [socketRef, incidentId, user]);

    // Listen for location updates from socket
    useEffect(() => {
        if (!socketRef.current) return;
        const handler = (data) => {
            dispatch(updateLiveLocation(data));
        };
        socketRef.current.on("locationUpdate", handler);
        return () => {
            if (socketRef.current) {
                socketRef.current.off("locationUpdate", handler);
            }
        };
    }, [socketRef, dispatch]);

    // Prepare markers for map
    const markers = liveLocations
        .filter(u => u.location?.coordinates)
        .map(u => ({
            lng: u.location.coordinates[0],
            lat: u.location.coordinates[1],
            label: `${u.name} (${u.role})`,
            type: u.role,
            userId: u.userId,
        }));

    // Use assignedIncident location as center if available
    const center = assignedIncident?.location?.coordinates
        ? { lng: assignedIncident.location.coordinates[0], lat: assignedIncident.location.coordinates[1] }
        : markers[0] || { lng: 0, lat: 0 };

    return <IncidentMapClient markers={markers} center={center} selfUserId={user?._id} />;
}

