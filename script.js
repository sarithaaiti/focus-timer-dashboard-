// ----- Timer -----
let focusMinutes = 25;
let remainingSeconds = focusMinutes * 60;
let timerId = null;
let isRunning = false;

const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const sessionCountEl = document.getElementById("session-count");

function loadSessionCount() {
  const saved = localStorage.getItem("sessionCount");
  sessionCountEl.textContent = saved ? Number(saved) : 0;
}

function saveSessionCount(count) {
  localStorage.setItem("sessionCount", String(count));
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

function tick() {
  if (remainingSeconds > 0) {
    remainingSeconds--;
    updateDisplay();
  } else {
    clearInterval(timerId);
    isRunning = false;
    alert("Session complete! 🎉");
    const current = Number(sessionCountEl.textContent) || 0;
    const next = current + 1;
    sessionCountEl.textContent = next;
    saveSessionCount(next);
  }
}

startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    timerId = setInterval(tick, 1000);
  }
});

pauseBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerId);
  isRunning = false;
  remainingSeconds = focusMinutes * 60;
  updateDisplay();
});

// ----- Tasks -----
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [];
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.className = "task-text" + (task.completed ? " completed" : "");
    span.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Undo" : "Done";
    toggleBtn.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// ----- Init -----
loadSessionCount();
updateDisplay();
loadTasks();
