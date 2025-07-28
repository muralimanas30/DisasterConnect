"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProfileThunk,
    updateProfileThunk,
    clearStatus,
} from "../../store/userSlice";
import TextInput from "../../components/form/TextInput";
import SubmitButton from "../../components/SubmitButton";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { user, loading, error, success } = useSelector((state) => state.user);
    const [form, setForm] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        // Only fetch profile on initial mount
        dispatch(fetchProfileThunk());
    }, [dispatch]);

    useEffect(() => {
        if (user) setForm(user);
    }, [user]);

    // Clear success/error message after showing for 3 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                dispatch(clearStatus());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfileThunk(form));
    };

    useEffect(() => {
        if (success) {
            setEditing(false);
        }
    }, [success]);

    const isChanged = useMemo(() => {
        if (!form || !user) return false;
        return (
            form.name !== user.name ||
            form.phone !== user.phone ||
            form.role !== user.role
        );
    }, [form, user]);

    // Check if user is assigned to an incident
    const assignedIncident = user?.assignedIncident;

    if (loading && !form)
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    if (!form)
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="alert alert-warning">No profile data.</div>
            </div>
        );

    return (
        <div className="container mx-auto py-10">
            {/* Show success message */}
            {success && (
                <div className="alert alert-success mb-4" role="alert">
                    {success}
                </div>
            )}
            {/* Show error message */}
            {error && (
                <div className="alert alert-error mb-4" role="alert">
                    {error}
                </div>
            )}
            <Breadcrumbs
                items={[
                    { label: "Home", href: "/" },
                    { label: "Profile" },
                ]}
            />
            <div
                className="card bg-base-200 shadow-xl max-w-lg mx-auto transition-all duration-500 ease-in-out"
                style={{ minHeight: editing ? 520 : 400 }}
            >
                <div className="card-body">
                    <h1 className="card-title text-2xl mb-2">User Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Name"
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                        <TextInput
                            label="Email"
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                            disabled
                        />
                        <TextInput
                            label="Phone"
                            name="phone"
                            value={form.phone || ""}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                        {/* Role can be changed only if not assigned to an incident */}
                        {editing && !assignedIncident ? (
                            <div className="mb-4">
                                <label className="label">Role</label>
                                <select
                                    className="select select-bordered w-full"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    disabled={!!assignedIncident}
                                >
                                    {/* Only allow switching between victim and volunteer */}
                                    {user && user.role === "victim" && (
                                        <>
                                            <option value="victim">Victim</option>
                                            <option value="volunteer">
                                                Volunteer
                                            </option>
                                        </>
                                    )}
                                    {user && user.role === "volunteer" && (
                                        <>
                                            <option value="volunteer">
                                                Volunteer
                                            </option>
                                            <option value="victim">Victim</option>
                                        </>
                                    )}
                                    {user && user.role === "admin" && (
                                        <option value="admin">Admin</option>
                                    )}
                                </select>
                            </div>
                        ) : (
                            <TextInput
                                label="Role"
                                name="role"
                                value={form.role || ""}
                                onChange={handleChange}
                                disabled
                            />
                        )}
                        <div className="flex gap-2 mt-4">
                            {!editing ? (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                            ) : (
                                <SubmitButton loading={loading} disabled={loading || !isChanged}>
                                    Save
                                </SubmitButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}