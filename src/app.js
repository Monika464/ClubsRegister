const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("dotenv").config();

const app = express();
//do captcha
app.use(express.urlencoded({ extended: true })); // obsługuje dane typu URL-encoded
app.use(express.json());

require("./db/mongoose");
const clubRouter = require("./routes/club");
const userRouter = require("./routes/user");
const managerRouter = require("./routes/manager");
const arenaRouter = require("./routes/arena");

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
app.use(managerRouter);
app.use(arenaRouter);

// Definicje tras
app.get("", (req, res) => {
  res.render("index", {
    title: "Competition Management Database",
    name: "Monika",
  });
});

app.get("/clubpanel", (req, res) => {
  res.render("clubpanel", {
    helpText: "This is some helpful text.",
    title: "Club Panel",
    name: "Monika",
  });
});

app.get("/clubsignup", (req, res) => {
  res.render("clubsignup", {
    helpText: "signup",
    title: "Club Signup",
    name: "Monika",
  });
});

app.get("/clublogin", (req, res) => {
  res.render("clublogin", {
    helpText: "login",
    title: "Club Login",
    name: "Monika",
  });
});

app.get("/clublogout", (req, res) => {
  res.render("clublogout", {
    helpText: "logout",
    title: "Club Logout",
    name: "Monika",
  });
});

// app.get("/clubsignpanel", (req, res) => {
//   res.render("clubsignpanel", {
//     helpText: "ccc",
//     title: "Club signin panel",
//     name: "Monika",
//   });
// });

app.get("/clubdelete", (req, res) => {
  res.render("clubdelete", {
    helpText: "ccc",
    title: "Club Delete Panel",
    name: "Monika",
  });
});

///roots for member

app.get("/userpanel", (req, res) => {
  res.render("userpanel", {
    helpText: "This is some helpful text.",
    title: "Member Panel",
    name: "Monika",
  });
});

app.get("/usersignup", (req, res) => {
  res.render("membersignup", {
    helpText: "signup",
    title: "Member Signup",
    name: "Monika",
  });
});

app.get("/userlogin", (req, res) => {
  res.render("userlogin", {
    helpText: "login",
    title: "Member Login",
    name: "Monika",
  });
});

app.get("/userlogout", (req, res) => {
  res.render("userlogout", {
    helpText: "logout",
    title: "Member Logout",
    name: "Monika",
  });
});

app.get("/usersignpanel", (req, res) => {
  res.render("usersignpanel", {
    helpText: "ccc",
    title: "Member Sign Panel",
    name: "Monika",
  });
});

app.get("/usersignupbyclub", (req, res) => {
  res.render("usersignupbyclub", {
    helpText: "ccc",
    title: "User signup by club",
    name: "Monika",
  });
});

app.get("/userdelete", (req, res) => {
  res.render("userdelete", {
    helpText: "ccc",
    title: "User Delete Panel",
    name: "Monika",
  });
});

app.get("/managerlogin", (req, res) => {
  res.render("managerlogin", {
    helpText: "ccc",
    title: "Manager Login",
    name: "Monika",
  });
});

app.get("/managerlogout", (req, res) => {
  res.render("managerlogout", {
    helpText: "ccc",
    title: "Manager Login",
    name: "Monika",
  });
});

app.get("/managerpanel", (req, res) => {
  res.render("managerpanel", {
    helpText: "ccc",
    title: "Manager Panel",
    name: "Monika",
  });
});

app.get("/arenasapply", (req, res) => {
  res.render("arenasapply", {
    helpText: "ccc",
    title: "Apply for an arena",
    name: "Monika",
  });
});

app.get("/arenasparticipants", (req, res) => {
  res.render("arenasparticipants", {
    helpText: "ccc",
    title: "Participants for an arena",
    name: "Monika",
  });
});

app.get("/clubpaneledit", (req, res) => {
  res.render("clubpaneledit", {
    helpText: "ccc",
    title: "Club corecting users page",
    name: "Monika",
  });
});

app.get("/clubprofileedit", (req, res) => {
  res.render("Club Profile Edit", {
    helpText: "ccc",
    title: "club profile edit page",
    name: "Monika",
  });
});

app.get("/managerpaneledit", (req, res) => {
  res.render("Manager Panel Edit", {
    helpText: "ccc",
    title: "managerpaneledit",
    name: "Monika",
  });
});

app.get("/arenacreate", (req, res) => {
  res.render("arenacreate", {
    helpText: "ccc",
    title: "Arena Create",
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
