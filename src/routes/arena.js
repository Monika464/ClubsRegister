const express = require("express");
const Manager = require("../models/manager");
const Arena = require("../models/arena");
const authClub = require("../middleware/authClub");
const authManager = require("../middleware/authManager");
const router = new express.Router();

//create arena powizane z managerem z create user

router.post("/arenas", authManager, async (req, res) => {
  // Konwersja pól datowych na obiekty Date
  const arenaTimeRegisOpen = new Date(req.body.arenaTimeRegisOpen);
  const arenaTimeRegisClose = new Date(req.body.arenaTimeRegisClose);
  const arenaTimeStart = new Date(req.body.arenaTimeStart);
  const arenaTimeClose = new Date(req.body.arenaTimeClose);
  const arenaTimeRelease = new Date(req.body.arenaTimeRelease);

  // Sprawdzenie poprawności konwersji
  if (
    isNaN(arenaTimeRelease.getTime()) ||
    isNaN(arenaTimeRegisOpen.getTime()) ||
    isNaN(arenaTimeRegisClose.getTime()) ||
    isNaN(arenaTimeStart.getTime()) ||
    isNaN(arenaTimeClose.getTime())
  ) {
    return res.status(400).send("Invalid date format");
  }

  // Przykładowe logowanie dla sprawdzenia
  // console.log("Converted Dates:");
  // console.log("arenaTimeRelease:", arenaTimeRegisOpen);
  // console.log("arenaTimeRegisOpen:", arenaTimeRelease);
  // console.log("arenaTimeRegisClose:", arenaTimeRegisClose);
  // console.log("arenaTimeStart:", arenaTimeStart);
  // console.log("arenaTimeClose:", arenaTimeClose);

  // Możesz teraz używać tych dat do dalszego przetwarzania, np. zapisywania do bazy danych
  // np. tworzysz obiekt do zapisu:
  const arenaEvent = {
    title: req.body.title,
    description: req.body.description,
    arenaTimeRelease: arenaTimeRelease,
    arenaTimeRegisOpen: arenaTimeRegisOpen,
    arenaTimeRegisClose: arenaTimeRegisClose,
    arenaTimeStart: arenaTimeStart,
    arenaTimeClose: arenaTimeClose,
    owner: req.manager._id,
  };

  try {
    const arena = new Arena(arenaEvent);
    await arena.save();

    res.status(201).send({ arena });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/arenas", authManager, async (req, res) => {
  // console.log("recbody", req.body);
  //const user = new User(req.body);
  // const arena = new Arena({
  //   ...req.body,
  //   owner: req.manager._id,
  // });
  //console.log("hello tu", user);
});

router.get("/arenas", authManager, async (req, res) => {
  try {
    //console.log("co mamy req", req.body);
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

router.get("/arenas/all", authClub, async (req, res) => {
  try {
    const arenas = await Arena.find({}); // Pobranie danych z bazy
    res.render("displayallarenas", { arenas });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/arenas/apply", authClub, async (req, res) => {
  try {
    // Pobierz wszystkie areny z bazy danych
    const arenas = await Arena.find({});
    res.status(200).send(arenas);
  } catch (error) {
    console.error("Error fetching arenas:", error);
    res.status(500).send({ error: "Failed to fetch arenas" });
  }
});

router.post("/arenas/apply/bulk", authClub, async (req, res) => {
  try {
    //const { arenaId, userIds } = req.headers; // lub req.body, jeśli dane są wysyłane w body zapytania
    const arenaId = req.headers["arenaid"];
    const userIds = JSON.parse(req.headers["userids"]);
    // Sprawdzenie poprawności danych
    if (!arenaId || !userIds) {
      return res.status(400).send({ error: "Missing arenaId or userIds" });
    }

    // Znajdowanie i aktualizowanie areny
    const arena = await Arena.findById(arenaId);
    if (!arena) {
      return res.status(404).send({ error: "Arena not found" });
    }

    console.log("arena", arena);

    //   // Dodawanie userIds do participants
    //arena.participants.push(userIds); // Parsowanie, jeśli userIds jest tablicą jako JSON string
    arena.participants.push(...userIds);
    await arena.save();

    res.status(200).send({ message: "Users added successfully", arena });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;

// router.get("/arenas/all", authClub, async (req, res) => {
//   try {
//     // Pobierz wszystkie areny z bazy danych
//     const arenas = await Arena.find({});
//     res.status(200).send(arenas);
//   } catch (error) {
//     console.error("Error fetching arenas:", error);
//     res.status(500).send({ error: "Failed to fetch arenas" });
//   }
// });

//add one user to arena

//add many users to arena

//edit arena

//create arena announcement

module.exports = router;
