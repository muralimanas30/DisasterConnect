require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/drcp',
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
    // Add this for mongoose 6+ to avoid deprecated options warning
    MONGO_OPTIONS: {
        // useNewUrlParser and useUnifiedTopology are not needed in mongoose >= 6
    }
};
