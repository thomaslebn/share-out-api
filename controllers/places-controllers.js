const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("./location");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Eiffel Tower",
    description: "The most beautiful tower in the world ! 😍",
    imageUrl:
      "https://www.sortiraparis.com/images/80/1467/535466-la-tour-eiffel-fete-la-saint-valentin.jpg",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
    location: {
      lat: 48.858093,
      lng: 2.294694,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Tokyo Skytree",
    description: "The second tallest structure in the world 🇯🇵",
    imageUrl: "https://scitechdaily.com/images/Tokyo-Skytree-Night.jpg",
    address: "1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-8634, Japan",
    location: {
      lat: 35.710064,
      lng: 139.810699,
    },
    creator: "u1",
  },
];

const getPlaceById = (req, res) => {
  const pId = req.params.pId;
  try {
    const place = DUMMY_PLACES.find((p) => p.id === pId);
    if (!place) {
      throw error;
    }
    res.json({ place });
  } catch (error) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
};

const getPlacesByUserId = (req, res) => {
  const uId = req.params.uId;
  try {
    const placesByUser = DUMMY_PLACES.filter((place) => place.creator === uId);
    if (!placesByUser) {
      throw error;
    }
    res.json({ placesByUser });
  } catch (error) {
    throw new HttpError(
      "Could not find a place for the provided user id test.",
      404
    );
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }
  const pId = req.params.pId;
  const { title, description } = req.body;
  const placeIdx = DUMMY_PLACES.findIndex((p) => p.id === pId);

  try {
    if (placeIdx === undefined) {
      throw error;
    }

    const newPlace = { ...DUMMY_PLACES.find((p) => p.id === pId) };
    newPlace.title = title;
    newPlace.description = description;
    DUMMY_PLACES[placeIdx] = newPlace;

    res.status(200).json({ place: newPlace });
  } catch (error) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
};

const deletePlaceById = (req, res) => {
  const pId = req.params.pId;
  const index = DUMMY_PLACES.findIndex((p) => p.id === pId);
  try {
    if (pId === undefined || index === -1) {
      throw error;
    }
    DUMMY_PLACES.splice(index, 1);
  } catch (error) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.status(200).json({ message: "The place has been deleted." });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
