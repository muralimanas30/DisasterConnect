"use client";
/**
 * Incidents Route Error Boundary
 * Shows detailed error message for incidents pages.
 */
function getErrorMessage(error) {
    return (
        error?.msg ||
        error?.message ||
        error?.error ||
        error?.data?.error ||
        error?.data?.msg ||
        error?.data?.message ||
        error?.toString() ||
        "Unknown error occurred in incidents."
    );
}

export default function IncidentsError({ error, reset }) {
    console.error("[IncidentsError]", error);
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="card w-full max-w-xl shadow-lg bg-base-200 p-6">
                <div className="flex flex-col items-center">
                    <svg width="56" height="56" viewBox="0 0 24 24" className="mb-4 text-error" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <path d="M8 15l4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" />
                    </svg>
                    <span className="font-bold text-lg text-error">Incident Error</span>
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
