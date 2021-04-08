const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pId", placesControllers.getPlaceById);

router.get("/user/:uId", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }).notEmpty(),
    check("address").isLength({ min: 5 }).notEmpty(),
    check("creator").notEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pId",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }).notEmpty(),
  ],
  placesControllers.updatePlaceById
);

router.delete("/:pId", placesControllers.deletePlaceById);

module.exports = router;
