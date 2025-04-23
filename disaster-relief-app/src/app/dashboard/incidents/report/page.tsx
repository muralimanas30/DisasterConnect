"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch for updating Redux state
import axios from "axios";
import { setUser } from "@/lib/slice/userSlice"; // Assuming you have a Redux slice for user state

const disasters = [
    "floods",
    "forest_fires",
    "earthquakes",
    "hurricanes",
    "pandemics",
    "droughts",
    "tornadoes",
    "industrial_accidents",
];

export default function ReportIncidentPage() {
    const user = useSelector((store: any) => store.user); // Get user data from the Redux store
    const dispatch = useDispatch(); // Initialize dispatch for updating Redux state
    const [formData, setFormData] = useState({
        title: "",
        incident_type: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
    
        // Ensure user information is valid
        if (!user || !user._id) {
            setError("User information is missing. Please log in again.");
            setLoading(false);
            return;
        }
    
        // Prepare the data to match the backend's expected format
        const payload = {
            title: formData.title,
            incident_type: formData.incident_type,
            description: formData.description,
            location: user.location,
            reported_by: user._id, // Automatically populate from the store
            status: "active",
            live: true,
        };
    
        try {
            console.log("Payload:", payload); // Debugging log
            const response = await axios.post<any>("/api/incidents", payload);
            const { savedIncident, newUser } = response.data; // Extract savedIncident and newUser from the response
    
            console.log("Backend response:", response.data); // Debugging log
    
            // Update the user state in Redux
            dispatch(setUser(newUser));
    
            // Reset the form and show success message
            setSuccess(true);
            setFormData({
                title: "",
                incident_type: "",
                description: "",
            });
        } catch (error) {
            console.error("Error reporting incident:", error);
            setError("Failed to report the incident. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Report an Incident</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block font-medium">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="incident_type" className="block font-medium">
                        Disaster Type
                    </label>
                    <select
                        id="incident_type"
                        name="incident_type"
                        value={formData.incident_type}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                    >
                        <option value="" disabled>
                            Select a disaster type
                        </option>
                        {disasters.map((disaster) => (
                            <option key={disaster} value={disaster}>
                                {disaster.replace("_", " ").toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">Incident reported successfully!</p>}
        </div>
    );
}