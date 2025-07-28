const { server } = require('./app');
const { PORT } = require('./config');
const connectDB = require('./db/connect');

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`DRCP server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });