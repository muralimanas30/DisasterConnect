const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, msg: err.message });
};

module.exports = errorHandler;
