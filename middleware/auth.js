const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const dotenv = require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return next(new Error("1 - Authentication failed!"));
    }

    const decodedToken = jwt.verify(token, JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("2 - Authentication failed!", 403);
    return next(error);
  }
};
