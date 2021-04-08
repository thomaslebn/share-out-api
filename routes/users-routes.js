const express = require("express");
const { check } = require("express-validator");

const userControllers = require("../controllers/user-controllers");

const router = express.Router();

router.get("/", userControllers.getAllUsers);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail(),
    check("password").isLength({ min: 8 }).trim().notEmpty(),
  ],
  userControllers.signUp
);

router.post("/login", userControllers.login);

module.exports = router;
