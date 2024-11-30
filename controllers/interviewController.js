const Interview = require("../models/interview");

const scheduleInterview = async (req, res) => {
  try {
    const { date, time, recruiterId, candidateId } = req.body;

    const conflict = await Interview.findOne({ date, time });
    if (conflict)
      return res.status(400).json({ message: "Time slot already booked" });

    const interview = new Interview({ date, time, recruiterId, candidateId });
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: "Error scheduling interview", error });
  }
};

const deleteInterviewById = async (req, res) => {
  try {
    const interviewId = req.params.id;

    const result = await Interview.deleteOne({ _id: interviewId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({
      status: "success",
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting interview", error });
  }
};

const updateInterviewById = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const { date, time, recruiterId, candidateId } = req.body;

    const conflict = await Interview.findOne({ date, time });
    if (conflict) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { date, time, recruiterId, candidateId },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({
      status: "success",
      data: updatedInterview,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating interview", error });
  }
};
module.exports = {
  scheduleInterview,
  deleteInterviewById,
  updateInterviewById,
};
