"use strict"

let undoneTasks = [];
let doneTasks = [];

undoneTasks = JSON.parse(localStorage.getItem("undoneTasks") || "[]");
doneTasks = JSON.parse(localStorage.getItem("doneTasks") || "[]");
console.log(undoneTasks);
console.log(doneTasks);
undoneTasks.forEach(item => buildTaskItem(item));
doneTasks.forEach(item => buildTaskItem(item));

// Event listener for create button
let btn = document.querySelector(".collapse-button");

btn.addEventListener("click", function() {
  this.classList.toggle("active");
  let content = this.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  }
  else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});


// Main process


let addTask = document.getElementById("add-task-button");

addTask.addEventListener("click", function () {
  let title = document.getElementById("new-task-name").value;
  let description = document.getElementById("new-task-description").value;
  let deadline = document.getElementById("new-task-deadline").value;

  let importanceRadios = document.getElementsByName("importance");
  let importance = null;
  for(let i = 0; i < importanceRadios.length; ++i) {
    if(importanceRadios[i].checked) {
      importance = importanceRadios[i].value;
      importanceRadios[i].checked = false;
      break;
    }
  }

  if(title === "" || importance === null)
    return;
  let task = new TodoObject(title, description, deadline, importance);

  document.getElementById("new-task-name").value = "";
  document.getElementById("new-task-description").innerHTML = "";
  document.getElementById("new-task-deadline").innerHTML = "";

  undoneTasks.push(task);
  buildTaskItem(task);
  //addEventListeners(task, taskItem);

  localStorage.setItem("undoneTasks", JSON.stringify(undoneTasks));
  btn.click();

});


// Functions

function TodoObject(title, description, deadline, importance) {
  this.title = title;
  this.description = description;
  this.deadline = deadline;
  this.importance = importance;
  this.status = false;
}

function pickColor(importanceLevel) {
  let color = "";
  switch (importanceLevel) {
    case "0":
      color = "#1E90FF";
      break;
    case "1":
      color = "#FF8C00";
      break;
    case "2":
      color = "#DC143C";
      break;
    default:
      break;
  }
  return color;
}

function buildTaskItem(task) {

  let listName = task.status ? "completed-tasks-list"
                             : "pending-tasks-list";

  let disclaimer = document.getElementById(listName).querySelector(".disclaimer");
  disclaimer.classList.add("hide-disclaimer");


  let listItem = document.createElement("li");

  //Task button header
  let taskButton = document.createElement("button");
  taskButton.setAttribute("class", "task-item");
  taskButton.setAttribute("type", "button");

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  let timeID = "task-mark_" + new Date().toISOString();
  checkbox.setAttribute("id", timeID);
  checkbox.setAttribute("class", "task-checkbox")
  let checked = task.status ? 'checked' : '';
  if(checked)
    checkbox.setAttribute("checked", "");

  let checkboxLabel = document.createElement("label");
  checkboxLabel.setAttribute("for", timeID);

  let checkmark = document.createElement("span");
  checkmark.setAttribute("class", "checkmark");

  checkboxLabel.append(checkbox, checkmark);

  let sign = document.createElement("span");
  sign.setAttribute("class", "button-sign");
  sign.innerHTML = "&plus;";

  let name = document.createElement("span");
  name.setAttribute("class", "task-title");
  name.innerText = task.title;
  name.style.textDecoration = task.status ? "line-through" : "none";

  //taskButton.appendChild(checkboxLabel);
  taskButton.innerHTML = checkboxLabel.outerHTML + name.outerHTML + sign.outerHTML;
  //taskButton.appendChild(sign);

  taskButton.style.borderLeftColor = task.status ? "#828282" : pickColor(task.importance);

  //Task content
  let content = document.createElement("div");
  content.setAttribute("class", "task-content");
  if(task.deadline !== "") {
    let timeDeadline = document.createElement("p");
    timeDeadline.setAttribute("class", "task-deadline");
    //const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    timeDeadline.innerHTML = "Deadline: " + new Date(task.deadline).toLocaleString("ru-RU");
    content.appendChild(timeDeadline);
  }
  if(task.description !== "") {
    let descript = document.createElement("p");
    descript.setAttribute("class", "task-description");
    descript.innerHTML = "Description: <br>" + task.description;
    content.appendChild(descript);
  }

  content.style.borderLeft = task.status ? "8px solid #828282"
                                         : "8px solid " + pickColor(task.importance);

  let deleteTask = document.createElement("button");
  deleteTask.setAttribute("type", "button");
  deleteTask.setAttribute("class", "task-delete");
  deleteTask.innerText = "Delete task";

  let editTask = document.createElement("button");
  editTask.setAttribute("type", "button");
  editTask.setAttribute("class", "task-edit");
  editTask.innerText = "Edit task";

  content.appendChild(deleteTask);
  content.appendChild(editTask);

  listItem.append(taskButton, content);
  document.getElementById(listName).appendChild(listItem);

  addEventListeners(task, listItem);

  return listItem;
}

function addEventListeners(task, listItem) {

  listItem.querySelector(".task-item").addEventListener("click", function () {
    this.classList.toggle("task-expand");
    let sign = listItem.querySelector(".button-sign");
    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    }
    else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
    if (sign.innerText === "+")
      sign.innerText = "−";
    else
      sign.innerText = "+";
  })

  listItem.querySelector(".task-delete").addEventListener("click", function() {
    if(task.status) {
      document.getElementById("completed-tasks-list").removeChild(this.parentNode.parentNode);
      let disclaimer = document.getElementById("completed-tasks-list").querySelector(".disclaimer");
      if(document.getElementById("completed-tasks-list").childElementCount === 1)
        disclaimer.classList.remove("hide-disclaimer");
    }
    else {
      document.getElementById("pending-tasks-list").removeChild(this.parentNode.parentNode);
      let disclaimer = document.getElementById("pending-tasks-list").querySelector(".disclaimer");
      if(document.getElementById("pending-tasks-list").childElementCount === 1)
        disclaimer.classList.remove("hide-disclaimer");
    }

    if(!task.status) {
      undoneTasks.splice(undoneTasks.indexOf(task), 1);
    }
    else  {
      doneTasks.splice(doneTasks.indexOf(task), 1);
    }

    localStorage.setItem("undoneTasks", JSON.stringify(undoneTasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
    });
  
  listItem.querySelector(".task-edit").addEventListener("click", function (e) {
    if(task.status)
      e.preventDefault();
    else {
      if(!btn.nextElementSibling.style.maxHeight)
        btn.click();

      listItem.querySelector(".task-delete").click();

      document.getElementById("new-task-name").value = task.title;
      document.getElementById("new-task-description").value = task.description;
      if(task.deadline !== null)
        document.getElementById("new-task-deadline").value = task.deadline;
      let radios = document.getElementsByName("importance");
      for(let i = 0; i < radios.length; ++i) {
        if(radios[i].value === task.importance) {
          radios[i].checked = true;
          break;
        }
      }
    }

  });

  const mark = listItem.querySelector(".task-item").firstElementChild.querySelector(".task-checkbox");
  mark.addEventListener("click", function () {
    task.status = this.checked;
    let disclaimerPending = document.getElementById("pending-tasks-list").querySelector(".disclaimer");
    let disclaimerCompleted = document.getElementById("completed-tasks-list").querySelector(".disclaimer");


    if(task.status) {
      undoneTasks.splice(undoneTasks.indexOf(task), 1);
      doneTasks.push(task);

      document.getElementById("completed-tasks-list").prepend(this.parentNode.parentNode.parentNode);

      if(document.getElementById("pending-tasks-list").childElementCount === 1) {
        disclaimerPending.classList.remove("hide-disclaimer");
      }

      if(document.getElementById("completed-tasks-list").childElementCount > 1) {
        disclaimerCompleted.classList.add("hide-disclaimer");
      }

      let movedItemTitle = document.getElementById("completed-tasks-list")
                                   .firstElementChild
                                   .querySelector(".task-item")
                                   .querySelector(".task-title");
      movedItemTitle.style.textDecoration = "line-through";
    }

    else {
      doneTasks.splice(doneTasks.indexOf(task), 1);
      undoneTasks.push(task);

      document.getElementById("pending-tasks-list").prepend(this.parentNode.parentNode.parentNode);

      if(document.getElementById("completed-tasks-list").childElementCount === 1) {
        disclaimerCompleted.classList.remove("hide-disclaimer");
      }

      if(document.getElementById("pending-tasks-list").childElementCount > 1) {
        disclaimerPending.classList.add("hide-disclaimer");
      }

      let movedItemTitle = document.getElementById("pending-tasks-list")
                                    .firstElementChild
                                    .querySelector(".task-item")
                                    .querySelector(".task-title");
      movedItemTitle.style.textDecoration = "none";
    }

    listItem.querySelector(".task-item").style.borderLeft = task.status ? "8px solid #828282"
                                                                        : "8px solid " + pickColor(task.importance);

    listItem.querySelector(".task-content").style.borderLeft = task.status ? "8px solid #828282"
                                                                           : "8px solid " + pickColor(task.importance);

    localStorage.setItem("undoneTasks", JSON.stringify(undoneTasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));

  });

}

// function sortTasks(list) {
//   list.sort(())
// }
