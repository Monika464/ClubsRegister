const jwt = require("jsonwebtoken");
const Club = require("../models/club");
const { log } = require("console");

const auth = async (req, res, next) => {
  const tokenenv = process.env.TOKEN_DECIFER_CLUB;
  //require("dotenv").config();
  try {
    //przekierowanie nie dziala

    //const token = authHeader.replace("Bearer ", "");
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("token w authClub", token);
    //const decoded = jwt.verify(token, "thisistokenclub");
    const decoded = jwt.verify(token, tokenenv);

    const club = await Club.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!club) {
      throw new Error();
    }
    if (!token) {
      res.locals.isClubLoggedIn = false;
    }
    //res.locals.isClubLoggedIn = true;
    req.token = token;
    req.club = club;
    res.locals.isClubLoggedIn = true;
    //console.log(`club ${req.club} logged in`);
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
    //res.locals.isClubLoggedIn = false;
    res.locals.isClubLoggedIn = false;
  }
};

module.exports = auth;
