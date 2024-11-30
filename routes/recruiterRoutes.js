const express = require("express");
const router = express.Router();
const {
  addRecruiter,
  assignRecruiterToInterview,
} = require("../controllers/recruiterController");

router.post("/", addRecruiter);

router.post("/assign", assignRecruiterToInterview);

module.exports = router;
