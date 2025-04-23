const {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} = require("../errors/errors");

const User = require("../models/user.model");

const registerUser = async (req, res) => {
    const { username, password, email, location, role } = req.body;

    if (!username || !password || !email || !location?.coordinates || !role) {
        throw new BadRequestError("All fields are required.");
    }

    let user;
    try {
        user = await User.findOne({ username });
    } catch (error) {
        console.log(error);
        next(error);
    }
    if (user) {
        throw new ConflictError("user already exists");
    }
    user = await User.create({ username, password, email, location, role });
    const token = user.generateToken();
    res.status(201).json({
        success: true,
        msg: "user registered",
        user,
        token,
    });
};
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        throw new BadRequestError("both username and password are required.");

    let user = await User.findOne({ username });
    if (!user) throw new NotFoundError("user not found");

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) throw new UnauthorizedError("password does not match");

    const token = user.generateToken();
    res.status(200).json({ success: true, msg: "user logged in", user, token });
};

const updateUser = async (req, res) => {
    const _id = req.params.id;
    if (!_id) throw new BadRequestError("id is not sent");

    const { username, email, role, phone_number, location } = req.body;

    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (phone_number) updateData.phone_number = phone_number;
    if (location?.coordinates) {
        updateData.location = {
            type: "Point",
            coordinates: location.coordinates,
        };
    }

    if (Object.keys(updateData).length === 0) {
        throw new BadRequestError("No valid fields provided for update.");
    }

    const user = await User.findById(_id);
    if (!user) throw new NotFoundError("user not found");

    Object.assign(user, updateData);
    await user.save();

    res.status(200).json({
        success: true,
        msg: "user updated",
        user,
    });
};

const deleteUser = async (req, res) => {
    const _id = req.params.id;
    if (!_id) throw new BadRequestError("id is not sent");

    const user = await User.findByIdAndDelete(_id);
    if (!user) throw new NotFoundError("user not found");

    res.status(200).json({
        success: true,
        msg: "user deleted",
        user,
    });
};

const getUser = async (req, res) => {
    const _id = req.params.id;
    if (!_id) throw new BadRequestError("id is not sent");

    let user = await User.findById(_id);
    if (!user) throw new NotFoundError("user not found");

    res.status(200).json({ success: true, msg: "user data fetched", user });
};

// admin
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, msg: "all users fetched", users });
};
const deleteAllUsers = async (req, res) => {
    await User.deleteMany();
    res.status(200).json({ success: true, msg: "all users deleted" });
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    deleteAllUsers,
};
