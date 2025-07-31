const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');

function fetchTasks() {
  fetch('/tasks')
    .then(res => res.json())
    .then(data => {
      taskList.innerHTML = '';
      data.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox" ${task.done ? 'checked' : ''} onclick="toggleTask(${task.id})" />
          <span class="${task.done ? 'done' : ''}">${task.text}</span>
          <button onclick="deleteTask(${task.id})">❌</button>
        `;
        taskList.appendChild(li);
      });
    });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert('Enter a task!');
  fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  }).then(() => {
    taskInput.value = '';
    fetchTasks();
  });
}

function toggleTask(id) {
  fetch(`/tasks/${id}`, { method: 'PUT' })
    .then(() => fetchTasks());
}

function deleteTask(id) {
  fetch(`/tasks/${id}`, { method: 'DELETE' })
    .then(() => fetchTasks());
}

fetchTasks();