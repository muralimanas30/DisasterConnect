"use client";
/**
 * AlertTasks
 * Allows volunteers to send quick incident alerts (e.g., "Come to me", "Stay together") to all users in the incident.
 * Displays incoming alerts as chat messages and toast notifications.
 */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSocket from "../hooks/useSocket";
import { addSocketChatMessage } from "../store/slices/incidentSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ALERT_TYPES = [
    { type: "comeToMe", label: "Come to Me", color: "btn-primary" },
    { type: "stayTogether", label: "Stay Together", color: "btn-accent" },
    // Add more alert types as needed
];

export default function AlertTasks({ incidentId }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.user.token);
    const socketRef = useSocket(token, incidentId);

    // Listen for incoming alerts and show toast + chat message
    useEffect(() => {
        if (!socketRef.current) return;
        const handleAlert = (alert) => {
            // Show toast notification
            toast.info(alert.message, {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
            });
            // Optionally add to chat/messages
            dispatch(addSocketChatMessage({
                _id: `alert-${alert.timestamp}`,
                sender: { name: alert.name, role: alert.role, _id: alert.userId },
                message: `[ALERT] ${alert.message}`,
                sentAt: alert.timestamp,
                isAlert: true,
            }));
        };
        socketRef.current.on("incidentAlert", handleAlert);
        return () => {
            if (socketRef.current) {
                socketRef.current.off("incidentAlert", handleAlert);
            }
        };
    }, [socketRef, dispatch]);

    // Send alert to backend
    const sendAlert = (alertType) => {
        if (!socketRef.current || !incidentId || !user) return;
        console.log("[AlertTasks] Sending alert:", alertType);
        if (socketRef.current.connected) {
            console.log("[AlertTasks] Socket is connected:", socketRef.current.id);
        } else {
            console.warn("[AlertTasks] Socket is NOT connected");
        }
        // Add a debug log for the emit callback
        socketRef.current.emit("sendAlert", {
            userId: user._id,
            incidentId,
            alertType,
        }, (ack) => {
            console.log("[AlertTasks] sendAlert emit callback/ack:", ack);
        });
    };

    // Only volunteers can send alerts
    if (!user || user.role !== "volunteer") return null;

    return (
        <div className="card bg-base-200 shadow-xl my-6">
            <div className="card-body">
                <h3 className="card-title text-lg mb-2">Quick Alert Tasks</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {ALERT_TYPES.map((alert) => (
                        <button
                            key={alert.type}
                            className={`btn ${alert.color} btn-sm`}
                            onClick={() => sendAlert(alert.type)}
                        >
                            {alert.label}
                        </button>
                    ))}
                </div>
                <div className="text-xs opacity-70">
                    These alerts will be sent to all users in this incident and shown in chat.
                </div>
            </div>
        </div>
    );
}