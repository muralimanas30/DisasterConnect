"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../lib/redux-store";

export default function ClientOnlyProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Wait for client-side mount
    }, []);

    if (!mounted) return null;

    return <Provider store={store}>{children}</Provider>;
}
