const mongoose = require("mongoose");

const arenaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    arenaTimeRelease: {
      type: Date,
      //default: false,
      required: true,
    },

    arenaTimeRegisOpen: {
      type: Date,
      // default: false,
      required: true,
    },
    arenaTimeRegisClose: {
      type: Date,
      // default: false,
      required: true,
    },
    arenaTimeStart: {
      type: Date,
      // default: false,
      required: true,
    },
    arenaTimeClose: {
      type: Date,
      //default: false,
      required: true,
    },

    announcements: [
      {
        announcement: {
          type: String,
        },
      },
    ],
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Manager",
    },
  },
  {
    timestamps: true,
  }
);

const Arena = mongoose.model("Arena", arenaSchema);

module.exports = Arena;
