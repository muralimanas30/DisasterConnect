const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const Donation = require('../models/Donation');
const Incident = require('../models/Incident');
const { CustomError } = require('../errorHandler/errorHandler');
// const Razorpay = require('razorpay');

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

function toObjectId(id) {
    if (id instanceof mongoose.Types.ObjectId) return id;
    if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    throw new CustomError('Invalid ObjectId', 400);
}

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

const allocateResource = async ({ resourceId, incidentId }) => {
    const resourceObjId = toObjectId(resourceId);
    const incidentObjId = toObjectId(incidentId);
    const resource = await Resource.findById(resourceObjId);
    if (!resource) throw new CustomError('Resource not found', 404);

    const incident = await Incident.findById(incidentObjId);
    if (!incident) throw new CustomError('Incident not found', 404);

    if (resource.allocated) throw new CustomError('Resource already allocated', 400);

    resource.allocated = true;
    resource.incident = incidentObjId;
    await resource.save();

    if (!incident.resources.includes(resourceObjId)) {
        incident.resources.push(resourceObjId);
        await incident.save();
    }

    return resource;
};

const bulkAllocateResources = async ({ resourceIds, incidentId }) => {
    const incidentObjId = toObjectId(incidentId);
    const incident = await Incident.findById(incidentObjId);
    if (!incident) throw new CustomError('Incident not found', 404);

    const results = [];
    for (const resourceId of resourceIds) {
        const resourceObjId = toObjectId(resourceId);
        const resource = await Resource.findById(resourceObjId);
        if (!resource) {
            results.push({ resourceId, status: 'not_found' });
            continue;
        }
        if (resource.allocated) {
            results.push({ resourceId, status: 'already_allocated' });
            continue;
        }
        resource.allocated = true;
        resource.incident = incidentObjId;
        await resource.save();

        if (!incident.resources.includes(resourceObjId)) {
            incident.resources.push(resourceObjId);
        }
        results.push({ resourceId, status: 'allocated' });
    }
    await incident.save();
    return results;
};

const getDonationHistory = async (userId) => {
    return await Donation.find({ donor: userId }).populate('resource incident');
};

const getResourceById = async (resourceId) => {
    const resourceObjId = toObjectId(resourceId);
    const resource = await Resource.findById(resourceObjId);
    if (!resource) throw new CustomError('Resource not found', 404);
    return resource;
};

/**
 * Utility to seed initial resources if DB is empty.
 */
const seedInitialResources = async () => {
    const count = await Resource.countDocuments();
    if (count === 0) {
        await Resource.insertMany([
            { name: 'Food Packets', type: 'food', quantity: 500, donatedBy: null },
            { name: 'Water Bottles', type: 'water', quantity: 1000, donatedBy: null },
            { name: 'Transport Vouchers', type: 'transport', quantity: 200, donatedBy: null },
            { name: 'Medicine Kits', type: 'medicine', quantity: 300, donatedBy: null },
            { name: 'Blankets', type: 'shelter', quantity: 400, donatedBy: null }
        ]);
    }
};

module.exports = {
    donate,
    getResources,
    allocateResource,
    bulkAllocateResources,
    getDonationHistory,
    getResourceById,
    seedInitialResources,
};
