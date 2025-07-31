const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const tasksFile = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Utility to read tasks
const readTasks = () => {
  if (!fs.existsSync(tasksFile)) return [];
  const data = fs.readFileSync(tasksFile);
  return JSON.parse(data || '[]');
};

// Utility to save tasks
const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Add new task
app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    done: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// Update task (mark done)
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id == req.params.id);
  if (task) {
    task.done = !task.done;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter((t) => t.id != req.params.id);
  saveTasks(tasks);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});