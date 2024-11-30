const express = require("express");
const app = express();
const candidatesRoutes = require("./routes/candidateRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");

app.use(express.json());

app.use("/api/candidates", candidatesRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/recruiters", recruiterRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
