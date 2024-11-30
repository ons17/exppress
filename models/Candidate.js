const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["En attente", "Accepté", "Rejeté"],
    default: "En attente",
  },
  /*interviewHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
  ],*/
});

module.exports = mongoose.model("Candidate", candidateSchema);
