const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();

// Importy związane z bazą danych i modelami
require("./db/mongoose");
const clubRouter = require("./routes/club");
const userRouter = require("./routes/user");

// Ścieżki do katalogów
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "views");
const partialsPath = path.join(__dirname, "partials");

// Konfiguracja widoków Handlebars i ścieżek
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

// Middleware
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(clubRouter);
app.use(userRouter);

// Definicje tras
app.get("", (req, res) => {
  res.render("index", {
    title: "Club registration",
    name: "Monika",
  });
});

app.get("/clubpanel", (req, res) => {
  res.render("clubpanel", {
    helpText: "This is some helpful text.",
    title: "Club panel",
    name: "Monika",
  });
});

app.get("/clublogin", (req, res) => {
  res.render("clublogin", {
    helpText: "login",
    title: "Club login",
    name: "Monika",
  });
});

app.get("/clublogout", (req, res) => {
  res.render("clublogout", {
    helpText: "logout",
    title: "Club logout",
    name: "Monika",
  });
});

// Eksport aplikacji
module.exports = app;

// const path = require("path");
// const hbs = require("hbs");
// const express = require("express");
// const auth = require("../src/middleware/authClub");

// const publicDirectoryPath = path.join(__dirname, "../public");
// const viewsPath = path.join(__dirname, "views");
// const partialsPath = path.join(__dirname, "partials");

// const setupViewsAndStatic = (app) => {
//   // Setup static directory to serve
//   app.use(express.static(publicDirectoryPath));

//   // Set up Handlebars engine and views
//   app.set("views", viewsPath);
//   app.set("view engine", "hbs");
//   hbs.registerPartials(partialsPath);

//   app.get("/clubs", auth, async (req, res) => {
//     try {
//       const clubs = await Club.find(); // Pobierz wszystkie kluby z bazy danych
//       res.render("clubpanel", {
//         title: "Lista Klubów",
//         clubs, // Przekaż kluby do widoku
//       });
//     } catch (e) {
//       res.status(500).send(e);
//     }
//   });

//   // Route for the homepage
//   app.get("", (req, res) => {
//     res.render("index", {
//       title: "Club/members registration",
//       name: "Monika",
//     });
//   });

//   //   app.get("/clubpanel", (req, res) => {
//   //     res.render("clubpanel", {
//   //       helpText: "This is some helpful text.",
//   //       title: "Club panel",
//   //       name: "Monika",
//   //     });
//   //   });

//   app.get("/userpanel", (req, res) => {
//     res.render("userpanel", {
//       title: "User panel",
//       name: "Monika",
//     });
//   });
// };
// module.exports = setupViewsAndStatic;
