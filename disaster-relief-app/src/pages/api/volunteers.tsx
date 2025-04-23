import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Use the backend URL for fetching users
        const response = await axios.get<any>(`http://localhost:8000/api/users`);
        const { success, msg, users } = response.data; // Extract success, msg, and users from the response

        // Check if the response indicates success
        if (!success) {
            console.error("Backend error:", msg);
            return res.status(500).json({ error: msg || "Failed to fetch users from backend" });
        }

        // Check if the users field is an array
        if (!Array.isArray(users)) {
            console.error("Unexpected response format:", users);
            return res.status(500).json({ error: "Invalid response format from backend" });
        }

        // Filter users who are volunteers and format the response
        const volunteers = users
            .filter((user: any) => user.role === "volunteer") // Assuming 'role' identifies volunteers
            .map((volunteer: any) => ({
                id: volunteer._id,
                _id: volunteer._id,
                name: volunteer.username, // Use `username` for the name
                coordinates: {
                    lng: volunteer.location.coordinates[1],
                    lat: volunteer.location.coordinates[0],
                },
                assignedIncident: null, // Handle missing `assignedIncident`
            }));

        res.status(200).json(volunteers);
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ error: "Failed to fetch volunteers" });
    }
}