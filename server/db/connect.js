const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

const connectDB = async () => {
    await mongoose.connect(MONGO_URI);
    console.log("DB CONNECTED ....");
};

module.exports = connectDB;
