const express = require("express");
const Manager = require("../models/manager");
const authClub = require("../middleware/authClub");
const authManager = require("../middleware/authManager");
const router = new express.Router();

//router.post("/managers", authClub, async (req, res) => {
router.post("/managers", async (req, res) => {
  //const user = new User(req.body);
  //console.log("req manager", req);
  const manager = new Manager(req.body);
  //console.log("hello tu manager", manager);

  try {
    await manager.save();
    // const token = await manager.generateAuthToken();
    //res.status(201).send({ manager, token });
    console.log("manager created");
    res.status(201).send({ manager });
    //res.status(201).send({ user });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/managers/login", async (req, res) => {
  try {
    const manager = await Manager.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await manager.generateAuthToken();
    res.send({ manager, token, redirectTo: "/clubpanel" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get("/managers/me", authManager, async (req, res) => {
  try {
    //const clubs = await Club.find({});
    //console.log("me tutaj", req.club);
    res.send(req.manager);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.post("/managers/logout", authManager, async (req, res) => {
  try {
    req.manager.tokens = req.manager.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.manager.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/managers/me", authManager, async (req, res) => {
  try {
    // await req.club.remove();
    //sendCancelationEmail(req.user.email, req.user.name);

    await Manager.deleteOne({ _id: req.manager._id });
    res.send(req.manager);
    //console.log("club", req.club);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
