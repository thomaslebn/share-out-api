const express = require("express");

const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:pId", placesControllers.getPlaceById);

router.get("/user/:uId", placesControllers.getPlacesByUserId);

router.use(auth);

router.post("/", fileUpload.single("image"), placesControllers.createPlace);

router.patch("/:pId", placesControllers.updatePlaceById);

router.delete("/:pId", placesControllers.deletePlaceById);

module.exports = router;
