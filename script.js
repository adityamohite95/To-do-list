const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
function userId() {
  const user = JSON.parse(localStorage.getItem("user"))
}
// ✅ Load tasks from localStorage once
function loadTasks() {
  const token = localStorage.getItem("token");
  // listContainer.innerHTML = ""; // clear existing list first
  // const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // savedTasks.forEach(task => {
  //   renderTask(task.text, task.completed);
  // });
  fetch('https://taskraft.onrender.com/tasks', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
  })
    .then(res => res.json())
    .then((serverResponse => {
      serverResponse.forEach(task => {
        renderTask(task.title, task.status, task._id);
      });
    }));
}

function createNewTask() {
  const inputText = document.getElementById("input-box").value;
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const convertedUser = JSON.parse(user)
  console.log(typeof convertedUser);
  fetch('https://taskraft.onrender.com/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      "user": convertedUser._id,
      "title": inputText,
      "status": "pending"
    })
  })
    .then(res => res.json())
    .then((resssss) => console.log(resssss));
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

  //  fetch('http://192.168.1.6:8000/add', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     todo: 'Use DummyJSON in the project',
  //     completed: false,
  //     userId: 5,
  //   })
  // })
  // .then(res => res.json())
  // .then((serverResponse) => {

  // });
}

// ✅ Create a task element (used for both load and add)
function renderTask(text, status, id) {
  const li = document.createElement("li");
  li.dataset.id = id;
  if (status === "completed") li.classList.add("checked");

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
  renderTask(text);
  inputBox.value = "";
  saveTasks();
}

// ✅ Handle clicks (edit, delete, toggle)
listContainer.addEventListener("click", function (e) {
  const target = e.target;

  // Delete Task
  if (target.classList.contains("close")) {
    const li = target.parentElement;
    const taskId = li.dataset.id;
    const token = localStorage.getItem("token");
    if(confirm("are you sure you want to delete this task?")){
      fetch(`https://taskraft.onrender.com/task/${taskId}`,{
        method: "DELETE",
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data =>{
        console.log("Task Deleted:",data);
        li.remove();
        saveTasks();
      })
      .catch(err =>{
        console.error("Error deleting task:",err);
        alert("Failed to delete a task, Please try again.");
      });
    }
  }

  // Edit Task
  else if (target.classList.contains("edit")) {
    const li = target.parentElement;
    const textEl = li.querySelector(".task-text");
    const oldText = textEl.textContent.trim();
    const newText = prompt("Edit your Task:", oldText);

    const token = localStorage.getItem("token");
    const user =JSON.parse(localStorage.getItem("user"));
    const taskId = li.dataset.id;
    const status = li.classList.contains("checked") ? "completed" : "pending";
    if (newText !== null && newText.trim() !== "") {
      fetch(`https://taskraft.onrender.com/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
           title: newText,
           status: status,
           user: user._id
           })
      })
        .then(res => res.json())
        .then(data => {
          console.log("Updated:", data);
          textEl.textContent = newText;
          saveTasks();
        })
        .catch(err => console.error("Error updating task:", err));
    }
  }


  // Mark Completed
  else if (target.classList.contains("task-text")) {
    const li= target.parentElement;
    li.classList.toggle("checked");

    const token=localStorage.getItem("token");
    const taskId= li.dataset.id;
    const user =JSON.parse(localStorage.getItem("user"));
    
    const newStatus= li.classList.contains("checked")? "completed" : "pending";
    const title = li.querySelector(".task-text").textContent.trim();

    fetch(`https://taskraft.onrender.com/task/${taskId}`,{
      method : "PUT",
      headers : {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
         status: newStatus,
         user : user._id,
         title: title
        })
    })
    .then(res => res.json())
    .then(data=>console.log("Status Updated:", data))
    .catch(err =>console.error("Error updating status:", err));

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
