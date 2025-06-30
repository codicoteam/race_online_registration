const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },  
  description: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: false,
  },
  registrationPrice: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  RegistrationStatus: {
    type: String,
    enum: ["Open", "Closed", "Postponed"],
    default: "Open",
  },
  date: {
    type: String,
    required: true,
  },
  raceEvents: {
    type: [String],
    required: true,
  },   
});

module.exports = mongoose.model("races", registrationSchema);