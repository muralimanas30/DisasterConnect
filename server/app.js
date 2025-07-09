const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./errorHandler/errorHandler');
const routes = require('./routes');
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB (ensure connection before routes)
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Mount all API routes
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
