const Resource = require('../models/Resource');
const Donation = require('../models/Donation');
const Incident = require('../models/Incident');
const { CustomError } = require('../errorHandler/errorHandler');

const donate = async (donationData, user) => {
    const resource = new Resource({ ...donationData, donatedBy: user._id });
    await resource.save();
    const donation = new Donation({
        donor: user._id,
        resource: resource._id,
        incident: donationData.incident,
        quantity: donationData.quantity,
        status: 'pending'
    });
    await donation.save();
    return donation;
};

const getResources = async (query) => {
    return await Resource.find(query);
};

// Allocate a resource to an incident
const allocateResource = async ({ resourceId, incidentId }) => {
    const resource = await Resource.findById(resourceId);
    if (!resource) throw new CustomError('Resource not found', 404);

    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);

    if (resource.allocated) throw new CustomError('Resource already allocated', 400);

    resource.allocated = true;
    resource.incident = incidentId;
    await resource.save();

    // Optionally, add resource to incident's resources array
    if (!incident.resources.includes(resourceId)) {
        incident.resources.push(resourceId);
        await incident.save();
    }

    return resource;
};

const bulkAllocateResources = async ({ resourceIds, incidentId }) => {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);

    const results = [];
    for (const resourceId of resourceIds) {
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            results.push({ resourceId, status: 'not_found' });
            continue;
        }
        if (resource.allocated) {
            results.push({ resourceId, status: 'already_allocated' });
            continue;
        }
        resource.allocated = true;
        resource.incident = incidentId;
        await resource.save();

        if (!incident.resources.includes(resourceId)) {
            incident.resources.push(resourceId);
        }
        results.push({ resourceId, status: 'allocated' });
    }
    await incident.save();
    return results;
};

// Get donation/resource history for a user
const getDonationHistory = async (userId) => {
    return await Donation.find({ donor: userId }).populate('resource incident');
};

// Get resource details by ID
const getResourceById = async (resourceId) => {
    const resource = await Resource.findById(resourceId);
    if (!resource) throw new CustomError('Resource not found', 404);
    return resource;
};

module.exports = {
    donate,
    getResources,
    allocateResource,
    bulkAllocateResources,
    getDonationHistory,
    getResourceById,
};
