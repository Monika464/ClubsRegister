const jwt = require("jsonwebtoken");
const Club = require("../models/club");

const authClubStatus = async (req, res, next) => {
  const tokenenv = process.env.TOKEN_DECIFER_CLUB;

  try {
    const token = req.header("Authorization");
    console.log("Authorization header:", token);
    if (!token) {
      // Jeśli brak tokena, użytko wnik nie jest zalogowany
      res.locals.isClubLoggedIn = false;
      console.log("No auth header, club not logged in");
      return next();
    }

    //const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, tokenenv);

    const club = await Club.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!club) {
      throw new Error();
    }

    // Jeśli znaleziono klub, ustaw isLoggedIn na true
    res.locals.isClubLoggedIn = true;
    console.log("Club logged in:", club);
  } catch (e) {
    // Jeśli wystąpił błąd, ustaw isLoggedIn na false
    res.locals.isClubLoggedIn = false;
    console.log("Error during auth:", e);
  }
  next();
};

module.exports = authClubStatus;
