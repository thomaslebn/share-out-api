const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
const dotenv = require("dotenv").config();
const CONNECT_MONGODB_ATLAS = process.env.CONNECT_MONGODB_ATLAS;

const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      return next(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  return res.json({ message: error.message || "An unknown error occurred !" });
});

mongoose
  .connect(CONNECT_MONGODB_ATLAS, connectConfig)
  .then(() => app.listen(process.env.PORT || 5000))
  .catch((err) => console.log(err));
