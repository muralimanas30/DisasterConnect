class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends CustomError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}


class NotFoundError extends CustomError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}


class ConflictError extends CustomError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

class InternalServerError extends CustomError {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}

class ForbiddenError extends CustomError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

module.exports = {BadRequestError, InternalServerError, ConflictError, NotFoundError, UnauthorizedError}