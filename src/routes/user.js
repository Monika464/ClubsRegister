const express = require("express");
const User = require("../models/user");
const authUser = require("../middleware/authUser");
const authClub = require("../middleware/authClub");
const authManager = require("../middleware/authManager");

const router = new express.Router();

router.get("/users/:id", authClub, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      owner: req.club._id,
    });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

router.patch("/users/:id", authClub, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "surname",
    "email",
    "age",
    "weight",
    "fights",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findOne({
      _id: req.params.id,
      owner: req.club._id,
    });
    // console.log("czy jest tu user", user);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(200).send({ message: "User updated successfully", user });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get("/users/arena", authManager, async (req, res) => {
  try {
    console.log("co z request", req.body);
    //const users = await User.find({});
    //res.send(users);
    //await req.club.populate("clubs").execPopulate();
    // await req.club.populate("clubs");
    // await req.arena.populate("users");
    // res.send(req.arena.users);
    //console.log("req.club", req.club);
  } catch {
    res.status(500).send();
  }
});

router.get("/users", authClub, async (req, res) => {
  try {
    await req.club.populate("users");
    res.send(req.club.users);
    //console.log("req.club", req.club);
  } catch {
    res.status(500).send();
  }
});

router.post("/users", authClub, async (req, res) => {
  //const user = new User(req.body);
  const user = new User({
    ...req.body,
    owner: req.club._id,
  });
  //console.log("hello tu", user);

  try {
    await user.save();
    //const token = await user.generateAuthToken();
    //res.status(201).send({ user, token });
    res.status(201).send({ user });
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
    res.send({ user, token, redirectTo: "/userpanel" });
  } catch (e) {
    console.error("Login error:", e); // Dodane logowanie błędu
    res.status(400).send({ error: e.message });
  }
});
router.get("/users/me", authUser, async (req, res) => {
  try {
    //const clubs = await Club.find({});
    //console.log("me tutaj", req.club);
    res.send(req.user);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.delete("/users/me", authUser, async (req, res) => {
  try {
    // await req.club.remove();
    //sendCancelationEmail(req.user.email, req.user.name);

    await User.deleteOne({ _id: req.user._id });
    res.send(req.user);
    console.log("user", req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logout", authUser, async (req, res) => {
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
