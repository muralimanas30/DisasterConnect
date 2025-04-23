const {
    NotFoundError,
    UnauthorizedError,
} = require("../errors/errors");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleWare = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedError("no token");

    let payload;
    try {
        payload = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        throw new UnauthorizedError("token invalid");
    }
    const _id = payload._id;

    const user = await User.findById(_id);
    if (!user) throw new NotFoundError("user does not exist");

    req.user = user;
    return next();
};

module.exports = authMiddleWare;
