const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const tasksFilePath = path.join(__dirname, "tasks.json");

// Serve files from "Public" folder (index.html, script.js, ramsethu.png)
app.use(express.static(path.join(__dirname, "../Public")));

// Route: Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Public/index.html"));
});

// Route: Get tasks from tasks.json
app.get("/api/tasks", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFilePath, "utf-8"));
  res.json(tasks);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
