const Recruiter = require("../models/Recruiter");
const Interview = require("../models/interview");

const addRecruiter = async (req, res) => {
  try {
    const { name, email } = req.body;
    const recruiter = new Recruiter({ name, email });
    await recruiter.save();
    res.status(201).json(recruiter);
  } catch (error) {
    res.status(500).json({ message: "Error adding recruiter", error });
  }
};

const assignRecruiterToInterview = async (req, res) => {
  try {
    const { interviewId, recruiterId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    interview.recruiterId = recruiter._id;
    await interview.save();

    res.json({
      status: "success",
      message: "Recruiter assigned to interview successfully",
      data: interview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning recruiter to interview", error });
  }
};

module.exports = { addRecruiter, assignRecruiterToInterview };
