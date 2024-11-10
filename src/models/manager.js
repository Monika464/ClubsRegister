const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const managerSchema = new mongoose.Schema(
  {
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
      trim: true,
    },
    surname: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          // required: true,
        },
      },
    ],

    arenas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Arenas",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Hash the plain text password before saving
managerSchema.pre("save", async function (next) {
  const manager = this;

  if (manager.isModified("password")) {
    manager.password = await bcrypt.hash(manager.password, 8);
  }

  next();
});

managerSchema.methods.toJSON = function () {
  const manager = this;
  const managerObject = manager.toObject();

  delete managerObject.password;
  //delete userObject.tokens;

  return managerObject;
};

managerSchema.methods.generateAuthToken = async function () {
  const tokenenv = process.env.TOKEN_DECIFER_MANAGER;
  require("dotenv").config();
  const manager = this;
  const token = jwt.sign({ _id: manager._id.toString() }, tokenenv);

  manager.tokens = manager.tokens.concat({ token });
  await manager.save();

  return token;
};

managerSchema.statics.findByCredentials = async function (email, password) {
  const manager = await Manager.findOne({ email });
  // console.log("email", email);
  // console.log("usseer", manager.password);
  // console.log("pass", password);
  // console.log("manager", password);

  if (!manager) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, manager.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return manager;
};

// managerSchema.virtual("managers", {
//   ref: "Manager",
//   localField: "_id",
//   foreignField: "owner",
// });
managerSchema.virtual("linkedArenas", {
  ref: "Arena",
  localField: "_id",
  foreignField: "owner",
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
