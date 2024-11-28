const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("./user");

const clubSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    resetToken: {
      type: String,
      default: null,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//Hash the plain text password before saving
clubSchema.pre("save", async function (next) {
  const club = this;

  if (club.isModified("password")) {
    club.password = await bcrypt.hash(club.password, 8);
  }

  next();
});

clubSchema.methods.toJSON = function () {
  const club = this;
  const clubObject = club.toObject();

  delete clubObject.password;
  //delete userObject.tokens;

  return clubObject;
};

clubSchema.methods.generateAuthToken = async function () {
  const tokenenv = process.env.TOKEN_DECIFER_CLUB;
  require("dotenv").config();
  const club = this;
  const token = jwt.sign({ _id: club._id.toString() }, tokenenv);

  club.tokens = club.tokens.concat({ token });
  await club.save();

  return token;
};

clubSchema.statics.findByCredentials = async function (email, password) {
  const club = await Club.findOne({ email });
  // console.log("email", email);
  // console.log("usseer", club.password);
  // console.log("pass", password);
  // console.log("club", password);

  if (!club) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, club.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return club;
};

// clubSchema.virtual("clubs", {
//   ref: "Club",
//   localField: "_id",
//   foreignField: "owner",
// });
clubSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "owner",
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
