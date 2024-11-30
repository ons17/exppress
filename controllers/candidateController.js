const Candidate = require("../models/Candidate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const addCandidate = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, status } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingCandidate = await Candidate.findOne({ email });

    if (existingCandidate) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStatus = status || "En attente";

    const candidate = new Candidate({
      name,
      email,
      password: hashedPassword,
      status: newStatus,
    });

    await candidate.save();

    await sendEmail(
      candidate.email,
      "Votre candidature a été ajoutée",
      `Bonjour ${candidate.name},\n\nVotre candidature a été ajoutée avec le statut : ${candidate.status}.`
    );

    // Envoyer un e-mail au recruteur
    await sendEmail(
      "recruteur@gmail.com",
      "Nouveau candidat ajouté",
      `Un nouveau candidat a été ajouté : ${candidate.name} (${candidate.email}).`
    );

    res.status(201).json(candidate);
  } catch (error) {
    console.error("Error adding candidate:", error);
    res.status(500).json({
      message: "Error adding candidate",
      error: error.message || "Unexpected error",
    });
  }
};

const deleteCandidateByIdController = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const result = await Candidate.deleteOne({ _id: candidateId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    await sendEmail(
      "recruteur@example.com",
      "Un candidat a été supprimé",
      `Le candidat avec l'ID ${candidateId} a été supprimé de la base de données.`
    );

    res.json({
      status: "success",
      message: "Candidat supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCandidateController = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        message: "At least one field (name or email) is required to update",
      });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { name, email },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    await sendEmail(
      candidate.email,
      "Votre statut a été mis à jour",
      `Bonjour ${candidate.name},\n\nVotre statut a été mis à jour à : ${candidate.status}.`
    );

    // Envoyer un e-mail au recruteur
    await sendEmail(
      "recruteur@example.com",
      "Mise à jour du statut d'un candidat",
      `Le statut du candidat ${candidate.name} (${candidate.email}) a été mis à jour à : ${candidate.status}.`
    );

    res.json({
      status: "success",
      message: "Candidat mis à jour avec succès",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCandidateHistoryController = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    const interviewHistory = await Interview.find({
      candidateId: candidateId,
    }).select("_id date time");

    res.json({
      status: "success",
      candidate,
      interviewHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*const getCandidateHistoryController = async (req, res) => {
  try {
    const candidateId = req.params.id;

    const candidate = await Candidate.findById(candidateId); /*populate({
      path: "interviewHistory",
      select: "date time feedback",
    });*/

/*  if (!candidate) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    res.json({
      status: "success",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }*/

const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const Candidate = await Candidate.findOne({ email });

    if (!Candidate) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const isPasswordValid = await bcrypt.compare(password, Candidate.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: Candidate._id, email: Candidate.email },
      "votre_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Authentification réussie.",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCandidate,
  deleteCandidateByIdController,
  getCandidateHistoryController,
  updateCandidateController,
  loginCandidate,
};
