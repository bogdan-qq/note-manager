const express = require("express");
const cors = require("cors");
const path = require("path");

const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(env.rootDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(env.rootDir, "NoteManager.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: path.basename(env.databaseFilePath),
  });
});

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use(errorMiddleware);

module.exports = app;
