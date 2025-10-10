const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// ✅ Load tasks from localStorage once
function loadTasks() {
  listContainer.innerHTML = ""; // clear existing list first
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
}

// ✅ Save all tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#list-container li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").textContent.trim(),
      completed: li.classList.contains("checked")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Create a task element (used for both load and add)
function createTaskElement(text, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("checked");

  // Task text
  const spanText = document.createElement("span");
  spanText.className = "task-text";
  spanText.textContent = text;
  li.appendChild(spanText);

  // Edit button
  const spanEdit = document.createElement("span");
  spanEdit.className = "edit";
  spanEdit.textContent = "✏️";
  li.appendChild(spanEdit);

  // Delete button
  const spanClose = document.createElement("span");
  spanClose.className = "close";
  spanClose.textContent = "\u00D7";
  li.appendChild(spanClose);

  listContainer.appendChild(li);
}

// ✅ Add new task
function addTask() {
  const text = inputBox.value.trim();
  if (text === "") {
    alert("Write Something");
    return;
  }
  createTaskElement(text);
  inputBox.value = "";
  saveTasks();
}

// ✅ Handle clicks (edit, delete, toggle)
listContainer.addEventListener("click", function (e) {
  const target = e.target;

  // Delete Task
  if (target.classList.contains("close")) {
    target.parentElement.remove();
    saveTasks();
  }

  // Edit Task
  else if (target.classList.contains("edit")) {
    const li = target.parentElement;
    const textEl = li.querySelector(".task-text");
    const oldText = textEl.textContent.trim();
    const newText = prompt("Edit your Task:", oldText);
    if (newText !== null && newText.trim() !== "") {
      textEl.textContent = newText;
      saveTasks();
    }
  }

  // Mark Completed
  else if (target.classList.contains("task-text")) {
    target.parentElement.classList.toggle("checked");
    saveTasks();
  }
});

// ✅ Load tasks initially
loadTasks();
const filter = document.getElementById("filter");

filter.addEventListener("change", function () {
  const selected = filter.value;
  const tasks = document.querySelectorAll("ul li");

  tasks.forEach(task => {
    // completed tasks have the "checked" class
    const isCompleted = task.classList.contains("checked");

    if (selected === "all") {
      task.style.display = "flex";
    } else if (selected === "completed" && isCompleted) {
      task.style.display = "flex";
    } else if (selected === "pending" && !isCompleted) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});
