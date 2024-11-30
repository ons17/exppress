const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  assignedInterviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  ],
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
