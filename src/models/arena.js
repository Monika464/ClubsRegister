const mongoose = require("mongoose");

const arenaSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    arenaTimeRelease: {
      type: Date, // Changed to Date for consistency
      default: false,
    },

    arenaTimeRegisOpen: {
      type: Date, // Changed to Date for consistency
      default: false,
    },
    arenaTimeRegisClose: {
      type: Date, // Changed to Date for consistency
      default: false,
    },
    arenaTimeStart: {
      type: Date, // Changed to Date for consistency
      default: false,
    },
    arenaTimeClose: {
      type: Date, // Changed to Date for consistency
      default: false,
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
