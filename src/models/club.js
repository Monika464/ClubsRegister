const mongoose = require("mongoose");
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
      },
    
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      }

})

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
