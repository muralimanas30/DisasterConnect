"use client";
/**
 * Pagination
 * Displays pagination controls for paginated data.
 * Props: pagination (object), onPageChange (function)
 */
import React from "react";

export default function Pagination({ pagination, onPageChange }) {
    if (!pagination) return null;
    const { page, totalPages } = pagination;
    if (totalPages <= 1) return null;

    return (
        <div className="flex gap-2 justify-center my-4">
            <button
                className="btn btn-xs btn-outline"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Prev
            </button>
            <span className="badge badge-info">{page} / {totalPages}</span>
            <button
                className="btn btn-xs btn-outline"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
