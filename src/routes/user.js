const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/authClub");
const router = new express.Router();

router.get("/users", auth, async (req, res) => {
  try {
    //const users = await User.find({});
    //res.send(users);
    //await req.club.populate("clubs").execPopulate();
    // await req.club.populate("clubs");
    await req.club.populate("users");
    res.send(req.club.users);
    console.log("req.club", req.club);
  } catch {
    res.status(500).send();
  }
});

router.post("/users", auth, async (req, res) => {
  //const user = new User(req.body);
  const user = new User({
    ...req.body,
    owner: req.club._id,
  });
  //console.log("hello tu", user);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    //res.status(201).send({ user });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
