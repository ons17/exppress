const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");

router.post("/", interviewController.scheduleInterview);

router.delete("/:id", interviewController.deleteInterviewById);

router.patch("/:id", interviewController.updateInterviewById);

module.exports = router;
