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

    // Emit only the user's location every 5 seconds
    useEffect(() => {
        if (!socketRef.current || !incidentId || !user?.currentLocation) return;
        const interval = setInterval(() => {
            socketRef.current.emit("updateLocation", {
                userId: user._id,
                incidentId,
                location: user.currentLocation,
                name: user.name,
                role: user.role,
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [socketRef, incidentId, user?.currentLocation, user?._id, user?._id, user?._id, user?._id]);

    // Listen for location updates from socket and update both liveLocations and user.currentLocation if it's self
    useEffect(() => {
        if (!socketRef.current) return;
        const handler = (data) => {
            dispatch(updateLiveLocation(data));
            // If the update is for the current user, update user.currentLocation in Redux
            if (data.userId === user?._id && data.location) {
                dispatch({
                    type: "user/updateCurrentLocation",
                    payload: data.location,
                });
            }
        };
        socketRef.current.on("locationUpdate", handler);
        return () => {
            if (socketRef.current) {
                socketRef.current.off("locationUpdate", handler);
            }
        };
    }, [socketRef, dispatch, user?._id]);

    // Prepare markers for map from liveLocations
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

// --- SOCKET FUNCTIONALITY SUMMARY ---
//
// 1. Location Sending (Client to Server):
//    - Every 5 seconds, the client emits the user's current location to the backend via:
//      socket.emit("updateLocation", {
//          userId: user._id,
//          incidentId,
//          location: user.currentLocation,
//          name: user.name,
//          role: user.role,
//      });
//  
// 2. Location Receiving (Server to Client):
//    - The client listens for "locationUpdate" events from the backend.
//    - On receiving a location update, it updates the Redux liveLocations array.
//    - If the update is for the current user, it also updates user.currentLocation in Redux.
//
// 3. Room Joining (Chat/Location):
//    - The client emits "joinIncident" with { incidentId, token } to join the incident's socket room.
//    - This enables receiving real-time updates for that incident.
//
// 4. Chat Messaging (see IncidentChat):
//    - The client emits "sendMessage" with { incidentId, message, user } to send a chat message.
//    - The backend broadcasts "newMessage" to all users in the incident room.
//    - The client listens for "newMessage" and updates the chat UI.
//
// --- END SOCKET FUNCTIONALITY SUMMARY ---

