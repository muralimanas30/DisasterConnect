import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Handle GET requests
    try {
      // Replace with the actual backend API URL
      const response = await axios.get(`http://localhost:8000/api/incidents`);
      const incidentsAndUser = response.data;

      // Return the incidentsAndUser as-is (assuming the backend formats them correctly)
      res.status(200).json(incidentsAndUser);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  } else if (req.method === "POST") {
    // Handle POST requests
    try {
      const payload = req.body;

      // Replace with the actual backend API URL
      const response = await axios.post(
        `http://localhost:8000/api/incidents`,
        payload
      );
      const newIncident = response.data;

      // Return the newly created incident
      res.status(201).json({success:true,newIncidentAndUser:newIncident});
    } catch (error) {
      console.error("Error creating incident:", error);
      res.status(500).json({ error: "Failed to create incident" });
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: "Method not allowed" });
  }
}
