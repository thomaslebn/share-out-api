const express = require("express");

const userControllers = require("../controllers/user-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", userControllers.getAllUsers);

router.post("/signup", fileUpload.single("image"), userControllers.signUp);

router.post("/login", userControllers.login);

module.exports = router;
