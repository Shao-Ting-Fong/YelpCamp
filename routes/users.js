const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

router.route("/register").get(users.renderRegister).post(catchAsync(users.registerUser));

const authenticateConfig = { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true };
router.route("/login").get(users.renderLogin).post(passport.authenticate("local", authenticateConfig), users.loginUser);

router.get("/logout", users.logout);

module.exports = router;
