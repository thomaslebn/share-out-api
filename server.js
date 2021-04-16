const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const CONNECT_MONGODB_ATLAS = process.env.CONNECT_MONGODB_ATLAS;

const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(express.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  return res.json({ message: error.message || "An unknown error occurred !" });
});

mongoose
  .connect(CONNECT_MONGODB_ATLAS)
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
