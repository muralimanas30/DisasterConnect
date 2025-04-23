const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    deleteAllUsers,
} = require("../controllers/user.controller");

const authMW = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/:id", authMW).get(getUser).patch(updateUser).delete(deleteUser);
// admin
router.route("/", authMW).get(getAllUsers).delete(deleteAllUsers);

module.exports = router;
