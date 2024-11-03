const app = require("./app"); // Import aplikacji z app.js
const port = process.env.PORT || 3000;

// Uruchomienie serwera
app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const express = require("express");
// //const app = express();
// const port = process.env.PORT || 3000;
// const Club = require("./models/club");
// // const clubRouter = require("./routes/club");
// // const userRouter = require("./routes/user");
// require("./db/mongoose");
// const app = require("./app");

// const path = require("path");
// const hbs = require("hbs");
// //const auth = require("../src/middleware/authClub");

// //const setupViewsAndStatic = require("./app");

// const publicDirectoryPath = path.join(__dirname, "../public");
// const viewsPath = path.join(__dirname, "views");
// const partialsPath = path.join(__dirname, "partials");

// // Setup static directory to serve
// app.use(express.static(publicDirectoryPath));

// // Set up Handlebars engine and views
// app.set("views", viewsPath);
// app.set("view engine", "hbs");
// hbs.registerPartials(partialsPath);

// //w Express.js jest middleware, które służy do parsowania danych JSON przychodzących w ciele żądań HTTP (np. POST, PUT itp.)
// app.use(express.json());
// app.use(clubRouter);
// app.use(userRouter);

// //setupViewsAndStatic(app);

// // app.set("views", path.join(viewsPath));
// // app.set("view engine", "hbs");
// // hbs.registerPartials(partialsPath);

// // // Setup static directory to serve
// app.use(express.static(publicDirectoryPath));

// app.get("", (req, res) => {
//   res.render("index", {
//     title: "Club registration",
//     name: "Monika",
//   });
// });

// //root do strony na ktorych cos jest po zalogowaniu
// app.get("/clubpanel", (req, res) => {
//   res.render("clubpanel", {
//     helpText: "This is some helpful text.",
//     title: "Club panel",
//     name: "Monika",
//   });
// });

// //rot do strony logowania dla klubu
// app.get("/clublogin", (req, res) => {
//   res.render("clublogin", {
//     helpText: "login",
//     title: "Club login",
//     name: "Monika",
//   });
// });

// // app.get("/userpanel", (req, res) => {
// //   res.render("adminpanel", {
// //     helpText: "This is organizer.",
// //     title: "Club panel",
// //     name: "Monika",
// //   });
// // });

// // app.get("/clublogout", (req, res) => {
// //   res.render("clublogout", {
// //     helpText: "logout",
// //     title: "Club logout",
// //     name: "Monika",
// //   });
// // });

// //https://www.npmjs.com/package/bcryptjs
// //roz 103

// //console.log("dir", __dirname);
// //console.log("file", __filename);

// // const myFunction = async () => {
// //   const password = "Red12345!";
// //   const hashedPassword = await bcrypt.hash(password, 8);
// //   const hashedPassword2 = await bcrypt.hash(password, 8);

// //   // console.log(password);
// //   // console.log(hashedPassword);

// //   const isMatch = await bcrypt.compare(hashedPassword, hashedPassword);
// //   const isMatch2 = await bcrypt.compare("Red12345!", hashedPassword2);
// //   console.log(isMatch, isMatch2);
// // };

// // myFunction();

// // Create a new club object

// // const club = new Club({
// //   name: "Awesome Post!",

// //   email: "muaythaikrakow2@gmail.com",
// //   password: "12345678",
// // });

// // club.save().then(() => console.log("club saved"));

// app.listen(port, () => {
//   console.log("Server is up on port " + port);
// });
