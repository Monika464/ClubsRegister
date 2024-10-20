const express = require("express");
const Club = require("../models/club");
const auth = require("../middleware/authClub");
const router = new express.Router();

// const app = express();
// app.get("/", (req, res) => {
//   res.send("hello world");
// });

router.get("/clubs", auth, async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.send(clubs);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.post("/clubs", async (req, res) => {
  const club = new Club(req.body);
  console.log("hello tu", club);

  try {
    await club.save();
    console.log("to club_id", club._id.toString());
    const token = await club.generateAuthToken();
    res.status(201).send({ club, token });
    //res.status(201).send({ club });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/clubs/login", async (req, res) => {
  try {
    const club = await Club.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await club.generateAuthToken();
    res.send({ club, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/clubs/logout", auth, async (req, res) => {
  try {
    req.club.tokens = req.club.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.club.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
