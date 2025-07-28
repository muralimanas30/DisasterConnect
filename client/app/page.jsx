"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Dashboard/Home Page
 * Shows role-based options, explanations, and navigation.
 */
export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/dashboard");
    }, [router]);
    return null;
}
