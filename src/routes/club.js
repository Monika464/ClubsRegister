const express = require("express");
const Club = require("../models/club");
//const auth = require("../middleware/auth");
const router = new express.Router();

// const app = express();
// app.get("/", (req, res) => {
//   res.send("hello world");
// });

router.post("/clubs", async (req, res) => {
  const club = new Club(req.body);
  console.log("hello tu", club);

  try {
    await club.save();
    // const token = await user.generateAuthToken();
    // res.status(201).send({ user, token });
    res.status(201).send({ club });
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
    //console.log("co tu", user, token);
    res.send({ club, token });
    //console.log("user", club);
    // res.send({ club });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;

// router.post("/users/login", async (req, res) => {
//   try {
//     const user = await User.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     const token = await user.generateAuthToken();
//     console.log("co tu", user, token);
//     res.send({ user, token });
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// });
