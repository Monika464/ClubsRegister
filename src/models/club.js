const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const validator = require("validator");

const hashfunction = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  return hashedPassword;
};

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
});

//Hash the plain text password before saving
clubSchema.pre("save", async function (next) {
  const club = this;

  if (club.isModified("password")) {
    club.password = await bcrypt.hash(club.password, 8);
  }

  next();
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
