const Incident = require("../models/incident.model");
const User = require("../models/user.model");
// Get all incidents
const getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find();
        const formattedIncidents = incidents.map((incident) => ({
            id: incident._id,
            title: incident.title,
            description: incident.description,
            coordinates: {
                lng: incident.location.coordinates[1],
                lat: incident.location.coordinates[0],
            },
            type: incident.incident_type,
        }));
        res.status(200).json(formattedIncidents);
    } catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).json({ error: "Failed to fetch incidents" });
    }
};
const createIncident = async (req, res) => {
    try {
        const { title, incident_type, description, location, reported_by, status, live } = req.body;

        // Validate required fields
        if (!title || !incident_type || !location || !reported_by) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the user exists
        const user = await User.findById(reported_by);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create a new incident
        const newIncident = new Incident({
            title,
            incident_type,
            description,
            location,
            reported_by,
            status: status || "active",
            live: live !== undefined ? live : true,
        });

        const savedIncident = await newIncident.save();

        // // Update the user's prevIncidents array
        
        // const newUser = await User.findByIdAndUpdate(
        //     reported_by,
        //     { $push: { prevIncidents: savedIncident._id } }, // Use $push to append the new incident ID
        //     { new: true }
        // );

        res.status(201).json({ savedIncident, newUser:user });
    } catch (error) {
        console.error("Error creating incident:", error);
        res.status(500).json({ error: "Failed to create incident" });
    }
};
const deleteAllIncidents = async (req, res) => {
    try {
        await Incident.deleteMany(); // Deletes all documents in the collection
        res.status(200).json({ message: "All incidents have been deleted successfully." });
    } catch (error) {
        console.error("Error deleting all incidents:", error);
        res.status(500).json({ error: "Failed to delete all incidents" });
    }
};

const updateIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ID
        if (!id) {
            return res.status(400).json({ error: "Incident ID is required" });
        }

        const updatedIncident = await Incident.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedIncident) {
            return res.status(404).json({ error: "Incident not found" });
        }

        res.status(200).json(updatedIncident);
    } catch (error) {
        console.error("Error updating incident:", error);
        res.status(500).json({ error: "Failed to update incident" });
    }
};

module.exports = {
    createIncident,
    updateIncident,
    getAllIncidents,
    deleteAllIncidents
};