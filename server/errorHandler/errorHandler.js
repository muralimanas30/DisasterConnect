class CustomError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date();
    }
}

const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode || 500,
        msg: err.message,
        details: err.details || undefined,
        timestamp: err.timestamp || new Date(),
    });
};

module.exports = { CustomError, errorHandler };
