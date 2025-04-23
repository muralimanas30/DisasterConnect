"use client";

import NavLink from "@/components/NavLink";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/lib/slice/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

const commonRoutes: { name: string; path: string; disabled?: boolean }[] = [
    { name: "Home", path: "/dashboard/home", disabled: false },
];

const volunteerRoutes: { name: string; path: string; disabled?: boolean }[] = [
    { name: "All Incidents", path: "/dashboard/incidents", disabled: false },
    { name: "Tasks", path: "/dashboard/tasks", disabled: false },
    { name: "Map", path: "/dashboard/map", disabled: false }, // Map route always accessible
];

export default function Navbar() {
    const { role } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const roleRoutes =
        role === "volunteer"
            ? volunteerRoutes
            : role === "victim"
            ? [
                  { name: "Report Incident", path: "/dashboard/incidents/report" },
                  { name: "Previous Reports", path: "/dashboard/incidents/previous" },
                  { name: "Map", path: "/dashboard/map", disabled: true }, // Disabled for victims without a report
              ]
            : [];

    const handleLogout = () => {
        dispatch(clearUser());
        sessionStorage.removeItem("userState");
        router.push("/login");
    };

    return (
        <div className="navbar bg-primary text-primary-content px-4 shadow-md">
            <div className="flex-1">
                <NavLink href="/" className="text-lg font-bold tracking-wide">
                    DRCP
                </NavLink>
            </div>

            <div className="flex-none lg:hidden">
                <button
                    title="navbar-opener"
                    type="button"
                    className="btn btn-ghost btn-square"
                    onClick={() => setOpen(!open)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

            <div className="hidden lg:flex gap-2 items-center">
                {[...commonRoutes, ...roleRoutes].map((link) => (
                    <NavLink
                        key={link.path}
                        href={link.disabled ? "#" : link.path}
                        className={`btn btn-ghost text-sm ${link.disabled ? "btn-disabled" : ""}`}
                    >
                        {link.name}
                    </NavLink>
                ))}
                <button className="btn btn-ghost text-sm" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}