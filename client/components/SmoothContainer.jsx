"use client";

/**
 * SmoothContainer
 * Wraps content with smooth grow/shrink transitions.
 * Use for all main containers/cards in the app.
 */
export default function SmoothContainer({ className = "", style = {}, children }) {
    return (
        <div
            className={`transition-all duration-500 ease-in-out ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
