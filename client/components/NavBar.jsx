"use client";
/**
 * Disaster Connect Navbar
 * Two-row responsive navbar:
 * - Top row: login/register, user info, role, logout, theme toggle.
 * - Bottom row: navigation links, centered (only if logged in).
 * No hydration errors. All list items have unique keys.
 */

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../store/userSlice";

export default function Navbar() {
    const user = useSelector((state) => state.user.user);
    const assignedIncident = useSelector((state) => state.incidents.assignedIncident);
    const dispatch = useDispatch();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem("theme");
            if (stored) setTheme(stored);
            document.documentElement.setAttribute("data-theme", stored || "light");
        }
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        if (typeof window !== "undefined") {
            sessionStorage.setItem("theme", newTheme);
            document.documentElement.setAttribute("data-theme", newTheme);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    // Navigation links for bottom row
    const navLinks = [
        { href: "/incidents", label: "Incidents" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "Profile" },
    ];
    if (assignedIncident) {
        navLinks.push(
            { href: `/incidents/${assignedIncident._id}/chat`, label: "Chat" },
            { href: `/incidents/${assignedIncident._id}/map`, label: "Map" }
        );
    }

    return (
        <nav className="w-full bg-base-200 shadow-lg">
            {/* Top Row */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-base-300">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="text-primary">
                        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-bold text-xl text-primary">Disaster Connect</span>
                </Link>
                <div className="flex items-center gap-4">
                    {/* Theme toggle */}
                    <button
                        className="btn btn-ghost btn-sm"
                        aria-label="Toggle dark/light mode"
                        onClick={handleThemeToggle}
                    >
                        {theme === "light" ? (
                            <span className="flex items-center gap-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" className="text-warning"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41M17.66 17.66l-1.41-1.41M6.34 6.34L4.93 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                Light
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" className="text-info"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                Dark
                            </span>
                        )}
                    </button>
                    {user && user.name && user.role ? (
                        <>
                            <span className="font-semibold text-base text-primary-content">
                                {user.name}
                            </span>
                            <span className="badge badge-outline badge-primary text-xs">
                                {user.role}
                            </span>
                            <button
                                className="btn btn-error btn-sm"
                                onClick={handleLogout}
                                type="button"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-outline btn-primary btn-sm">Login</Link>
                            <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
            {/* Bottom Row: Only show if user is logged in */}
            {user && (
                <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="btn btn-ghost btn-md font-semibold text-base-content"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}