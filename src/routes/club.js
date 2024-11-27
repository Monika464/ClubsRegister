const express = require("express");
const Club = require("../models/club");
const auth = require("../middleware/authClub");
const authManager = require("../middleware/authManager");
const router = new express.Router();
const axios = require("axios");
//const fetch = require("node-fetch");
//do catcha//

router.get("/clubs", authManager, async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.send(clubs);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.get("/clubs/me", auth, async (req, res) => {
  try {
    if (!req.club) {
      return res.status(404).send({ error: "Club not found" });
    }
    res.send(req.club);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.patch("/clubs/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "email",
    "city",
    "region",
    "phone",
    "password",
  ]; // lista dozwolonych pól do aktualizacji
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    if (!req.club) {
      return res.status(404).send({ error: "Club not found" });
    }

    updates.forEach((update) => {
      req.club[update] = req.body[update];
    });

    await req.club.save(); // Zapisanie zaktualizowanych danych do bazy

    res.send(req.club);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
// router.patch("/clubs/me/edit", auth, async (req, res) => {
//   try {
//     if (!req.club) {
//       return res.status(404).send({ error: "Club not found" });
//     }
//     res.send(req.club);
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

router.post("/clubs", async (req, res) => {
  //Pobierz odpowiedź CAPTCHA z żądania
  //console.log("reqbody", req.body);
  const captchaResponse = req.body["g-recaptcha-response"];
  //console.log("captcha res", captchaResponse);
  if (!captchaResponse) {
    return res.status(400).send({ error: "Please complete the CAPTCHA." });
  }

  //Zweryfikuj odpowiedź CAPTCHA

  const secretKey = process.env.CAPTCHA_SECRET_KEY;
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
    res.send({ club, token, redirectTo: "/clubpanel" });
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
