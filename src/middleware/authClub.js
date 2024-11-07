const jwt = require("jsonwebtoken");
const Club = require("../models/club");

const auth = async (req, res, next) => {
  try {
    //console.log("hej form auth");
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisistokenclub");
    const club = await Club.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!club) {
      throw new Error();
    }

    req.token = token;
    req.club = club;
    console.log(`club ${req.club} logged in`);
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
