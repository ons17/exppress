const express = require("express");
const router = express.Router();
const {
  addCandidate,
  deleteCandidateByIdController,
  getCandidateHistoryController,
  /*loginCandidate,*/
} = require("../controllers/candidateController");
//const authMiddleware = require("../middleware/authMiddleware");

router.post("/", addCandidate);

router.delete("/:id", deleteCandidateByIdController);

router.get("/:id/history", getCandidateHistoryController);
//router.get("/:email", /*authMiddleware*/, getUserByEmail);
//router.post("/login", loginUser);

module.exports = router;
