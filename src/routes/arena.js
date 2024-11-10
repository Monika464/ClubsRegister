const express = require("express");
const Manager = require("../models/manager");
const Arena = require("../models/arena");
const authClub = require("../middleware/authClub");
const authManager = require("../middleware/authManager");
const router = new express.Router();

//create arena powizane z managerem z create user

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

router.get("/arenas", authClub, async (req, res) => {
  try {
    //const users = await User.find({});
    //res.send(users);
    //await req.club.populate("clubs").execPopulate();
    // await req.club.populate("clubs");
    await req.manager.populate("linkedArenas");
    res.send(req.manager.linkedArenas);
    //console.log("req.club", req.club);
  } catch {
    res.status(500).send();
  }
});

//add one user to arena

//add many users to arena

//edit arena

//create arena announcement

module.exports = router;
