const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const prisma = require("./prisma");
const router = express.Router();
const { createUser, getUser } = require("./queries.js");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(username, hashedPassword);

    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002" && error.meta.target.includes("username")) {
      return res
        .status(409)
        .json({ error: "Username already exists. Please use anothe one" });
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Please, enter your username and password" });
  }

  try {
    const user = await getUser(username);

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with username ${username} not found` });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Invalid password. Please try again" });
    }

    const token = jwt.sign({ username }, process.env.SECRET_KEY);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
