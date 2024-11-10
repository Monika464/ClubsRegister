const express = require("express");
const Club = require("../models/club");
const auth = require("../middleware/authClub");
const router = new express.Router();
const axios = require("axios");
//const fetch = require("node-fetch");
//do catcha//

router.get("/clubs", auth, async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.send(clubs);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.get("/clubs/me", auth, async (req, res) => {
  try {
    //const clubs = await Club.find({});
    //console.log("me tutaj", req.club);
    res.send(req.club);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.post("/clubs", async (req, res) => {
  //Pobierz odpowiedź CAPTCHA z żądania
  //console.log("reqbody", req.body);
  const captchaResponse = req.body["g-recaptcha-response"];
  //console.log("captcha res", captchaResponse);
  if (!captchaResponse) {
    return res.status(400).send({ error: "Please complete the CAPTCHA." });
  }

  //Zweryfikuj odpowiedź CAPTCHA

  const secretKey = CAPTCHA_SECRET_KEY;
  //const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey, // Twój klucz sekretu reCAPTCHA
          response: captchaResponse,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ error: "Invalid CAPTCHA response." });
    }

    //Jeśli CAPTCHA jest poprawna, kontynuuj tworzenie klubu
    const club = new Club(req.body);
    await club.save();
    const token = await club.generateAuthToken();
    res.status(201).send({ club, token, redirectTo: "/clubpanel" });
  } catch (e) {
    res
      .status(500)
      .send({ error: "Something is wrogn check if email is not a duplicate." });
  }
});

//   const club = new Club(req.body);
//   // console.log("hello tu", club);

//   try {
//     await club.save();
//     // console.log("to club_id", club._id.toString());
//     const token = await club.generateAuthToken();
//     res.status(201).send({ club, token, redirectTo: "/clubpanel" });
//     //res.status(201).send({ club });
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// });

router.post("/clubs/login", async (req, res) => {
  try {
    const club = await Club.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await club.generateAuthToken();
    res.send({ club, token, redirectTo: "/clubpanel" });
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

router.delete("/clubs/me", auth, async (req, res) => {
  try {
    // await req.club.remove();
    //sendCancelationEmail(req.user.email, req.user.name);

    await Club.deleteOne({ _id: req.club._id });
    res.send(req.club);
    //console.log("club", req.club);
  } catch (e) {
    res.status(500).send();
  }
});

///signup, delete, waszystkie routes

module.exports = router;
