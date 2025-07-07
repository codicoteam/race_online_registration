const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "races",
    required: true,
  },
  raceName: {
    type: String,
    required: true,
  },
  racePrice: {
    type: Number,
    required: true,
  },
  raceEvent: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  natonalID: {
    type: String,
  },
  pollUrl: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed", "unpaid"],
    default: "unpaid",
  },
  Gender: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {                          // <--- Added email field
    type: String,
    required: true,
  },
  t_shirt_size: {
    type: String,
    required: true,
  },
  registration_number: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return 'MPR' + Math.floor(1000000000 + Math.random() * 9000000000);
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("registeredAthletes", registrationSchema);
