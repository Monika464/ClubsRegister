const express = require("express");
const Club = require("./models/club");
const clubRouter = require("./routes/club");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

//w Express.js jest middleware, które służy do parsowania danych JSON przychodzących w ciele żądań HTTP (np. POST, PUT itp.)
app.use(express.json());
app.use(clubRouter);
// Create a new club object

// const club = new Club({
//   name: "Awesome Post!",

//   email: "muaythaikrakow2@gmail.com",
//   password: "12345678",
// });

// club.save().then(() => console.log("club saved"));

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
