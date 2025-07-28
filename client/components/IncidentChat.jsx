"use client";
// IncidentChat: Real-time group chat for an incident. Fetches initial messages, connects to socket, sends/receives messages.

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSocket from "../hooks/useSocket";
import {
    fetchIncidentChatThunk,
    addSocketChatMessage,
    setChatMessages,
} from "../store/slices/incidentSlice";

export default function IncidentChat({ incidentId, user, token }) {
    // incidentId: string, user: {_id, name, ...}, token: JWT
    const dispatch = useDispatch();
    const { chatMessages, chatLoading, chatError } = useSelector(
        (state) => state.incidents
    );
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const chatEndRef = useRef(null);

    // Connect socket
    const socketRef = useSocket(token, incidentId);

    // Fetch initial chat messages only once per incidentId change
    useEffect(() => {
        if (!incidentId) return;
        dispatch(fetchIncidentChatThunk(incidentId));
    }, [incidentId, dispatch]);

    // Join incident room and listen for new messages
    useEffect(() => {
        if (!socketRef.current || !incidentId || !user) return;
        socketRef.current.emit("joinIncident", { incidentId, token });

        // Listen for new messages
        const handleNewMessage = (msg) => {
            // Remove optimistic message with same content, then add the real one
            dispatch(setChatMessages(
                Array.isArray(chatMessages)
                    ? [
                        ...chatMessages.filter(
                            m =>
                                !(
                                    m._id &&
                                    m._id.toString().startsWith("optimistic-") &&
                                    m.message === msg.message &&
                                    m.sender?._id === user._id
                                )
                        ),
                        msg
                    ]
                    : [msg]
            ));
            setSending(false);
        };
        socketRef.current.on("newMessage", handleNewMessage);

        return () => {
            if (socketRef.current) {
                socketRef.current.off("newMessage", handleNewMessage);
            }
        };
    // Depend on chatMessages so we always have the latest array
    }, [socketRef.current, incidentId, user, token, dispatch, chatMessages]);

    // Scroll to bottom when chatMessages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    // Optimistically add sent message to chatMessages
    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || !socketRef.current || !incidentId || !user) return;
        setSending(true);
        try {
            const optimisticMsg = {
                _id: `optimistic-${Date.now()}`,
                sender: user,
                message,
                sentAt: new Date().toISOString(),
            };
            dispatch(addSocketChatMessage(optimisticMsg));
            socketRef.current.emit("sendMessage", {
                incidentId,
                message,
                user,
            });
            setMessage("");
        } catch (err) {
            console.error("[IncidentChat] Error sending message:", err);
            setSending(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-4">
            <div className="mb-4 flex items-center gap-2">
                <span className="font-bold text-xl text-primary">Incident Chat</span>
                <span className="badge badge-info">{user?.role}</span>
            </div>
            {chatLoading && (
                <div className="flex justify-center my-2">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            )}
            {chatError && (
                <div className="alert alert-error my-2">{chatError}</div>
            )}
            <div className="bg-base-200 rounded-xl shadow-lg p-4 h-80 overflow-y-auto mb-4 border border-base-300">
                {chatMessages && chatMessages.length > 0 ? (
                    chatMessages.map((msg, idx) => {
                        // Defensive: handle missing sender
                        const sender = msg.sender || {};
                        const senderId = sender._id || sender.id || null;
                        const senderName = sender.name || "Unknown";
                        const senderRole = sender.role || "user";
                        const senderEmail = sender.email || null;
                        const isMe = senderId && user && senderId === user._id;
                        const isVolunteer = senderRole === "volunteer";
                        const isVictim = senderRole === "victim";
                        const bubbleColor = isMe
                            ? "chat-bubble-primary"
                            : isVolunteer
                                ? "chat-bubble-info"
                                : isVictim
                                    ? "chat-bubble-success"
                                    : "chat-bubble";
                        return (
                            <div
                                key={msg._id ? msg._id : `chatmsg-${idx}`}
                                className={`chat ${isMe ? "chat-end" : "chat-start"} mb-2`}
                            >
                                <div className="chat-header text-xs opacity-80 flex gap-2 items-center">
                                    <span className={`font-bold ${isVolunteer ? "text-info" : isVictim ? "text-success" : "text-neutral"}`}>
                                        {senderName}
                                    </span>
                                    <span className="badge badge-outline badge-xs">{senderRole}</span>
                                    <span className="ml-2 text-xs text-neutral">
                                        {msg.sentAt
                                            ? new Date(msg.sentAt).toLocaleTimeString()
                                            : ""}
                                    </span>
                                </div>
                                <div className={`chat-bubble ${bubbleColor} text-base`}>
                                    {msg.message}
                                </div>
                                {senderEmail && (
                                    <div className="chat-footer text-xs text-neutral opacity-60">
                                        {senderEmail}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-sm opacity-60">No messages yet.</div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form className="flex gap-2" onSubmit={handleSend}>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending || !message.trim()}
                >
                    {sending ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        "Send"
                    )}
                </button>
            </form>
        </div>
    );
}
