const express = require("express");
const User = require("../models/user");
const authUser = require("../middleware/authUser");
const authClub = require("../middleware/authClub");
const authClubStatus = require("../middleware/authClubStatus");
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
    res.status(400).send({ error: "not able to fetch" });
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
    res.status(201).send({ user, redirectTo: "/clubpanel" });
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
// router.get("/users/me", authUser, async (req, res) => {
//   try {
//     //const clubs = await Club.find({});
//     //console.log("me tutaj", req.club);
//     console.log("meee tutaj", req);
//     res.send(req.user);
//   } catch {
//     res.status(500).send({ error: e.message });
//   }
// });
router.get("/userss/me", authUser, async (req, res) => {
  try {
    //const clubs = await Club.find({});
    //console.log("me tutaj", req.club);

    res.send(req.user);
  } catch {
    res.status(500).send({ error: e.message });
  }
});

router.delete("/userss/me", authUser, async (req, res) => {
  try {
    // await req.club.remove();
    //sendCancelationEmail(req.user.email, req.user.name);

    await User.deleteOne({ _id: req.user._id });
    res.send(req.user);
    //console.log("user", req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/userss/me", authUser, async (req, res) => {
  try {
    // const updates = Object.keys(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "surname",
      "email",
      "age",
      "weight",
      "fights",
      "password",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    //const clubs = await Club.find({});
    //console.log("me tutaj", req.club);
    const user = req.user;

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Aktualizacja wartości
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    // console.log("to user", user);
    res.send(user);
  } catch {
    res.status(500).send({ error: e.message });
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

const multer = require("multer");
const sharp = require("sharp");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be a .jpg or .png"));
    }
    // cb(new Error('File must be a pdf'))
    // cb(undefined,true)
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  authUser,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    //console.log("req user", req.user.avatar);
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/users/me/avatar",
  authUser,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get(
  "/users/me/avatar",
  authUser, // Middleware do autoryzacji użytkownika
  async (req, res) => {
    try {
      const avatar = req.user.avatar;

      if (!avatar) {
        return res.status(404).send({ error: "Awatar nie został znaleziony" });
      }

      // Ustawienie nagłówka Content-Type odpowiednio do formatu obrazu
      res.set("Content-Type", "image/jpg"); // Dopasuj typ MIME do faktycznego formatu
      res.send(avatar); // Wysłanie danych awatara jako odpowiedź
    } catch (error) {
      res.status(500).send({ error: "Błąd serwera" });
    }
  }
);

router.patch(
  "/users/me/avatar",
  authUser,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: "Please upload a file" });
      }

      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

      req.user.avatar = buffer;
      await req.user.save();
      res.send({ message: "Avatar updated successfully" });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//console.log("file", __filename); // Pełna ścieżka do pliku
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error();
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);

    if (!user.avatar) {
      res.set("Content-Type", "image/png");
      res.sendFile("img/anonimblank.png");
      return;
    }
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
