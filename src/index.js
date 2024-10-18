const express = require("express");
const Club = require("./models/club");
const clubRouter = require("./routes/club");
require("./db/mongoose");
const bcrypt = require("bcryptjs");

//https://www.npmjs.com/package/bcryptjs
//roz 103

const app = express();
const port = process.env.PORT || 3000;

//w Express.js jest middleware, które służy do parsowania danych JSON przychodzących w ciele żądań HTTP (np. POST, PUT itp.)
app.use(express.json());
app.use(clubRouter);

const myFunction = async () => {
  const password = "Red12345!";
  const hashedPassword = await bcrypt.hash(password, 8);
  const hashedPassword2 = await bcrypt.hash(password, 8);

  // console.log(password);
  // console.log(hashedPassword);

  const isMatch = await bcrypt.compare(hashedPassword, hashedPassword);
  const isMatch2 = await bcrypt.compare("Red12345!", hashedPassword2);
  console.log(isMatch, isMatch2);
};

myFunction();

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
