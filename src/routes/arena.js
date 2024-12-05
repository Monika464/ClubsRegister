const express = require("express");
const Manager = require("../models/manager");
const User = require("../models/user");
const Arena = require("../models/arena");
const authClub = require("../middleware/authClub");
const authManager = require("../middleware/authManager");
const router = new express.Router();

//create arena powizane z managerem z create user

router.post("/arenas", authManager, async (req, res) => {
  // Konwersja pól datowych na obiekty Date
  const arenaTimeRelease = new Date(req.body.arenaTimeRelease);
  const arenaTimeRegisOpen = new Date(req.body.arenaTimeRegisOpen);
  const arenaTimeRegisClose = new Date(req.body.arenaTimeRegisClose);
  const arenaTimeStart = new Date(req.body.arenaTimeStart);
  const arenaTimeClose = new Date(req.body.arenaTimeClose);

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

// router.post("/arenas", authManager, async (req, res) => {
//   // console.log("recbody", req.body);
//   //const user = new User(req.body);
//   // const arena = new Arena({
//   //   ...req.body,
//   //   owner: req.manager._id,
//   // });
//   //console.log("hello tu", user);
// });

router.get("/arenas/manager", authManager, async (req, res) => {
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

// router.get("/arenas/all", authManager, async (req, res) => {
//   try {
//     const arenas = await Arena.find({}); // Pobranie danych z bazy
//     res.render("arenasList", { arenas });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

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
    const { arenaId, userIds } = req.body; // Dane wysyłane w body zapytania

    // Sprawdzenie poprawności danych
    if (!arenaId || !Array.isArray(userIds) || !userIds.length) {
      return res
        .status(400)
        .send({ error: "Missing or invalid arenaId or userIds" });
    }

    // const arenaId = req.headers["arenaid"];
    // const userIds = JSON.parse(req.headers["userids"]);
    // // Sprawdzenie poprawności danych
    // if (!arenaId || !userIds) {
    //   return res.status(400).send({ error: "Missing arenaId or userIds" });
    // }

    // Znajdowanie i aktualizowanie areny
    const arena = await Arena.findById(arenaId);
    if (!arena) {
      return res.status(404).send({ error: "Arena not found" });
    }

    //console.log("arena", arena);

    //   // Dodawanie userIds do participants
    //arena.participants.push(userIds); // Parsowanie, jeśli userIds jest tablicą jako JSON string
    //arena.participants.push(...userIds);
    // Dodawanie unikalnych userIds do participants
    arena.participants = Array.from(
      new Set([...arena.participants, ...userIds])
    );
    await arena.save();

    res.status(200).send({ message: "Users added successfully", arena });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal server error", details: error.message });
  }
});

//participants wiev for the club

router.get("/arenas/participants", authClub, async (req, res) => {
  const arenaId = req.headers["arenaid"];

  try {
    if (!arenaId) {
      return res.status(400).send({ error: "Arena ID is required" });
    }

    // Pobranie areny z uczestnikami
    const arena = await Arena.findById(arenaId).populate("participants");

    if (!arena) {
      return res.status(404).send({ error: "Arena not found" });
    }

    // Filtrowanie uczestników, aby wyświetlać tylko tych, których `owner` pasuje do ID klubu
    const clubId = req.club._id;
    const participants = arena.participants.filter((participant) => {
      return participant.owner.equals(clubId);
    });

    if (participants.length === 0) {
      return res
        .status(404)
        .send({ error: "No participants from this club found!" });
    }

    res.send(participants);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/arenas/participants/manager", authManager, async (req, res) => {
  const arenaId = req.headers["arenaid"];

  try {
    if (!arenaId) {
      return res.status(400).send({ error: "Arena ID is required" });
    }
    const arena = await Arena.findById(arenaId).populate("participants");
    //const arena = await Arena.findById(arenaId);

    // console.log("czy mamy arena", arena);

    if (!arena) {
      return res.status(404).send({ error: "Arena not found" });
    }

    const participants = arena.participants;

    if (!participants) {
      return res.status(404).send({ error: "No one apllied!" });
    }

    res.send(participants);
  } catch (error) {
    res.status(500).send(error);
  }
});

try {
  //router.patch("/arenass/:idarena", async (req, res) => {
  router.patch("/arenass/:iduser/:idarena", async (req, res) => {
    const idu = req.params.iduser;
    const ida = req.params.idarena;
    console.log("ida", ida);
    console.log("idu", idu);

    const arena = await Arena.findById(ida).populate("participants");
    if (!arena) {
      return res.status(404).send("Arena not found");
    }

    const participantIds = [];

    arena.participants.forEach((elem) => {
      console.log("elem", elem._id);
      participantIds.push(elem._id); // Dodaj ID do tablicy
    });

    arena.participants = arena.participants.filter(
      (participant) => participant._id.toString() !== idu
    );

    await arena.save();

    // Zwróć odpowiedź z nową listą uczestników
    res.json({
      message: "User removed from participants",
      participants: arena.participants,
    });
  });
} catch (error) {
  console.log(error);
  res.status(500).send("Wystąpił błąd serwera");
}

//ten z arena w body
try {
  //router.patch("/arenass/:idarena", async (req, res) => {
  router.patch("/arenass/:idarena", async (req, res) => {
    const ida = req.params.idarena;
    const usersToDeleteIds = req.body.usersToDeleteIds;

    if (!Array.isArray(usersToDeleteIds)) {
      return res
        .status(400)
        .send("Invalid request body: usersToDeleteIds should be an array");
    }

    console.log("ID Areny:", ida);
    //console.log("ID użytkowników do usunięcia:", usersToDeleteIds);

    const arena = await Arena.findById(ida).populate("participants");

    if (!arena) {
      return res.status(404).send("Arena not found");
    }

    arena.participants = arena.participants.filter(
      (participant) => !usersToDeleteIds.includes(participant._id.toString())
    );

    console.log("Pozostali uczestnicy:", arena.participants);
    arena.participants.forEach((el) => {
      console.log("el", el);
    });

    // Zapisz zmodyfikowaną tablicę w bazie danych
    await arena.save();

    // Zwróć odpowiedź z nową listą uczestników
    res.json({
      message: "User removed from participants",
      participants: arena.participants,
    });
  });
} catch (error) {
  console.log(error);
  res.status(500).send("Wystąpił błąd serwera");
}

// Route to delete selected users from the participants array
router.delete("/arenas/participants/delete", authClub, async (req, res) => {
  try {
    const { arenaId, selectedUsers } = req.body;
    //console.log("co tu jest", arenaId, selectedUsers);

    // Check if arenaId and selectedUsers are provided
    if (!arenaId || !selectedUsers || !Array.isArray(selectedUsers)) {
      return res.status(400).send({ error: "Invalid request data" });
    }
    //

    //
    // Find the arena and update the participants array by removing selected users
    const arena = await Arena.findOneAndUpdate(
      { _id: arenaId },
      {
        $pull: { participants: { $in: selectedUsers } },
      },
      { new: true } // Return the updated document
    );

    if (!arena) {
      return res.status(404).send({ error: "Arena not found" });
    }

    res.status(200).send({ message: "Selected participants removed", arena });
  } catch (error) {
    console.error("Error deleting participants:", error);
    res.status(500).send({ error: "Server error" });
  }
});

// Route to delete selected users from the participants array by manager
router.delete(
  "/arenas/participants/delete/manager",
  authManager,
  async (req, res) => {
    try {
      const { arenaId, selectedUsers } = req.body;

      // Check if arenaId and selectedUsers are provided
      if (!arenaId || !selectedUsers || !Array.isArray(selectedUsers)) {
        return res.status(400).send({ error: "Invalid request data" });
      }

      // Find the arena and update the participants array by removing selected users
      const arena = await Arena.findByIdAndUpdate(
        arenaId,
        {
          $pull: { participants: { $in: selectedUsers } },
        },
        { new: true } // Return the updated document
      );

      if (!arena) {
        return res.status(404).send({ error: "Arena not found" });
      }

      res.status(200).send({ message: "Selected participants removed", arena });
    } catch (error) {
      console.error("Error deleting participants:", error);
      res.status(500).send({ error: "Server error" });
    }
  }
);

router.get("/arenas/:id", authManager, async (req, res) => {
  const _id = req.params.id;

  try {
    const arena = await Arena.findOne({ _id, owner: req.manager._id });

    if (!arena) {
      return res.status(404).send();
    }

    res.send(arena);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/arenas/:id", authManager, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "description",
    "arenaTimeRegisOpen",
    "arenaTimeRegisClose",
    "arenaTimeStart",
    "arenaTimeClose",
    "withhold",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const arena = await Arena.findOne({
      _id: req.params.id,
      owner: req.manager._id,
    });

    if (!arena) {
      return res.status(404).send();
    }

    updates.forEach((update) => (arena[update] = req.body[update]));
    await arena.save();
    res.send(arena);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/arenas/:id", authManager, async (req, res) => {
  try {
    const arena = await Arena.findOneAndDelete({
      _id: req.params.id,
      owner: req.manager._id,
    });

    if (!arena) {
      res.status(404).send();
    }

    res.send(arena);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/arenass/all", async (req, res) => {
  try {
    // Pobierz wszystkie areny z bazy danych
    const arenas = await Arena.find({}); // Zakładając, że masz odpowiedni model Arena
    if (!arenas.length) {
      return res.status(404).send({ message: "No arenas found" });
    }
    res.status(200).json(arenas); // Użyj .json zamiast .send dla poprawnej struktury odpowiedzi
  } catch (error) {
    console.error("Error fetching arenas:", error);
    res.status(500).send({ error: "Failed to fetch arenas" });
  }
});

module.exports = router;

//add one user to arena

//add many users to arena

//edit arena

//create arena announcement

module.exports = router;
