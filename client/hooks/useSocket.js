import { BACKEND_URL } from "@/lib/constants";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || BACKEND_URL; // Adjust as needed

export default function useSocket(token, key = 0) {
    const socketRef = useRef(null);

    useEffect(() => {
        console.log("useSocket called with token:", token, "key:", key);
        if (!token) return;
        socketRef.current = io(SOCKET_URL, {
            auth: { token }
        });

        socketRef.current.on("connect", () => {
            console.log("Socket connected:", socketRef.current.id);
        });
        socketRef.current.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        return () => {
            socketRef.current && socketRef.current.disconnect();
            socketRef.current = null;
        };
    }, [token, key]);

    return socketRef;
}
