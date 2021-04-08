const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Thomas",
    email: "thomas@gmail.com",
    password: "password",
  },
  {
    id: "u2",
    name: "Max",
    email: "max@gmail.com",
    password: "password",
  },
];

const getAllUsers = (req, res) => {
  try {
    res.status(200).json({ users: DUMMY_USERS.map((user) => user) });
  } catch (error) {
    throw new HttpError("No user found.", 404);
  }
};

const signUp = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }
  const { name, email, password } = req.body;
  try {
    DUMMY_USERS.push({ id: uuid(), name, email, password });
    res.status(202).json({ user: DUMMY_USERS[DUMMY_USERS.length - 1] });
  } catch (error) {
    throw new HttpError("Invalid information.", 401);
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  try {
    const user = DUMMY_USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (user.length === 0) {
      throw error;
    }

    res.status(202).json({ user: user });
  } catch (error) {
    throw new HttpError("Invalid input", 422);
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
};
