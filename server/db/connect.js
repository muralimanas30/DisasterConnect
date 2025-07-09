const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

const connectDB = async () => {
    await mongoose.connect(MONGO_URI);
};

module.exports = connectDB;
