"use client";
/**
 * Global Error Boundary for DRCP frontend.
 * Catches React errors and displays a user-friendly message.
 */
import React from "react";

function getErrorMessage(error) {
    return (
        error?.msg ||
        error?.message ||
        error?.error ||
        error?.data?.error ||
        error?.data?.msg ||
        error?.data?.message ||
        error?.toString() ||
        "Unknown error occurred."
    );
}

export default function GlobalError({ error, reset }) {
    console.error("[GlobalError]", error);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
            <div className="card w-full max-w-xl shadow-lg bg-base-200 p-6">
                <div className="flex flex-col items-center">
                    <svg width="64" height="64" viewBox="0 0 24 24" className="mb-4 text-error" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                    <span className="font-bold text-lg text-error">Something went wrong</span>
                    <div className="mt-2 text-base-content text-center">
                        <div className="mb-2">{getErrorMessage(error)}</div>
                        <details className="bg-base-100 rounded p-2 text-xs opacity-80">
                            <summary className="cursor-pointer font-semibold">Error Details</summary>
                            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(error, null, 2)}</pre>
                        </details>
                    </div>
                    <button className="btn btn-outline btn-error btn-sm mt-6" onClick={reset}>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
