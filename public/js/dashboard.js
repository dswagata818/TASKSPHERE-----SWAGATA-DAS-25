const taskList = document.getElementById("list");


async function fetchTasks() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/tasks", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();

    taskList.innerHTML = ""; // clear old list

    if (res.ok) {
      data.forEach(task => {
        const div = document.createElement("div");
        div.classList.add("task-item");

        // main task content
        const content = document.createElement("div");
        content.innerHTML = `
          <strong>Title:</strong> ${task.title} <br>
          <strong>Description:</strong> ${task.description} <br>
          <strong>Status:</strong><span class="task-status"> ${task.status}</span>
        `;

        // action buttons
        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        //complete checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.status === "Completed";
        checkbox.dataset.id = task._id;

        checkbox.onchange = async () => {
          try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ status: checkbox.checked ? "Completed" : "Pending" })
            });

            const updated = await res.json();
            if (!res.ok) throw new Error(updated.error);

            const statusSpan = content.querySelector(".task-status");
            statusSpan.textContent = checkbox.checked ? "Completed" : "Pending";

             await updateTaskCount(); 
          } catch (err) {
            console.error(err);
            alert("Error updating task");
          }
        };

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
          const newTitle = prompt("Enter new title:", task.title);
          const newDesc = prompt("Enter new description:", task.description);
          if (newTitle && newDesc) {
            updateTask(task._id, { title: newTitle, description: newDesc });
          }
        };

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
          if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(task._id);
          }
        };

        actions.appendChild(checkbox);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        // combine content + actions
        div.appendChild(content);
        div.appendChild(actions);

        taskList.appendChild(div);
      });

      updateTaskCount(); 
    } else {
      console.error("Failed to fetch tasks:", data.message);
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

// UPDATE TASK 
async function updateTask(id, updates) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (res.ok) {
      fetchTasks(); 
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update task");
    }
  } catch (err) {
    console.error("Update error:", err);
  }
}

//DELETE TASK
async function deleteTask(id) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      fetchTasks(); 
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete task");
    }
    return true;
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// FETCH COUNTS 
async function updateTaskCount() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/tasks/count", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("pending-count").textContent = data.pending;
      document.getElementById("completed-count").textContent = data.completed;
    }
  } catch (err) {
    console.error("Count error:", err);
  }
}

//PAGE LOAD
window.addEventListener("DOMContentLoaded", () => {
  fetchTasks();
  updateTaskCount();
});

// MODAL & FORM 
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("addtaskbtn");
  const closeBtn = document.getElementById("closeFormBtn");
  const modal = document.getElementById("taskModal");

  
  openBtn.onclick = () => {
    modal.style.display = "flex";
  };

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };


  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };

  // Form Submit
  document.getElementById("taskForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();

      if (res.ok) {
        modal.style.display = "none";
        this.reset();
        fetchTasks(); 
        updateTaskCount(); 
        alert("Task Created!");
      } else {
        alert(data.message || "Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    }
  });
});

// LOGOUT
document.getElementById("log-out").addEventListener("click", () => {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem("token");  
    localStorage.removeItem("user");   
    window.location.href = "login.html";  
  }
});

//CREATE ACCOUNT
document.getElementById("createAccountBtn").addEventListener("click", () => {
  const confirmCreate = confirm("Are you sure you want to create a new account?");
  if (confirmCreate) {
    window.location.href = "register.html";  
  }
});