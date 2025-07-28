// Sample layout for profile route.
// Place profile-related data-fetching logic here.
"use client";
/**
 * Profile Layout
 * Place profile-related data-fetching logic (e.g., fetch user profile, update profile) here.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader"; // Adjust path if needed
// import { fetchUserProfileThunk } from "../../store/slices/userSlice"; // Uncomment and adjust import as needed

export default function ProfileLayout({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user?.user);
    const loading = useSelector(state => state.user?.loading);
    const router = useRouter();

    useEffect(() => {
        // Example: fetch user profile on mount
        // if (user?._id) {
        //     dispatch(fetchUserProfileThunk());
        // }
        if (!user && !loading) {
            router.replace("/login");
        }
    }, [user, loading, router, dispatch]);

    return (
        <>
            {loading && <Loader />}
            {children}
        </>
    );
}
