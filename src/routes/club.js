const express = require("express");
const Club = require("../models/club");
const auth = require("../middleware/authClub");
const authManager = require("../middleware/authManager");
const router = new express.Router();
const axios = require("axios");
const crypto = require("crypto");
const { sendEmail } = require("../emails/account");
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

///PASSWORD RECOVERY

//Password reset
router.get("/clubss/reset-password/:token", (req, res) => {
  res.render("clubresetpassword.hbs", { token: req.params.token }); // Przekazanie tokenu do widoku (opcjonalne)
});

router.post("/clubss/reset-password/:token", async (req, res) => {
  try {
    const club = await Club.findOne({
      resetToken: req.params.token,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!club) {
      return res.status(400).send({ error: "Token incorrect or expired" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).send({ error: "Passwords not match" });
    }

    club.password = req.body.newPassword;
    club.resetToken = undefined; // Usuń token po użyciu
    club.tokenExpiry = undefined;
    await club.save();
    res.render("email/passwordchanged");
    // res.status(200).send({ message: "Pass changed" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Password forgot

router.get("/clubss/forgot-password", (req, res) => {
  res.render("clubforgotpassword"); // formularz HTML
});

router.post("/clubss/forgot-password", async (req, res) => {
  try {
    const club = await Club.findOne({ email: req.body.email });
    if (!club) {
      return res.status(404).send({ error: "Club does not exists" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    //console.log("czy jest token", token);
    club.resetToken = token; // Zapisz token w bazie
    //console.log("token w bazie", user.resetToken);
    club.tokenExpiry = Date.now() + 3600000; // Ważność tokenu: 1 godzina
    //console.log("co w user", user);
    await club.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/clubss/reset-password/${token}`;
    console.log("url przed wysłaniem", resetUrl);
    sendEmail(club.email, "Password reset", `Click this link: ${resetUrl}`);
    res.render("email/emailsent", { email: club.email });
    //res.status(200).send({ message: "E-mail resetu wysłany" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

///

module.exports = router;
