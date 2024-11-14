import {addTaskToDB, checkTask, deleteTaskFromDB, editTaskInDB, getSubtasksPage} from "backend_interaction.js";

export function displayTasks(tasks) {
    console.log(tasks);
    const calendar = window.calendarInstance;
    calendar.removeAllEvents();
    tasks.forEach((task) => {
        displayTask(task, calendar);
    });
}

export function clearChildren(className) {
    const element = document.querySelector(className);
    while (element.firstChild)
        element.removeChild(element.firstChild);
}

function displayTask(task, calendar) {
    const event = {
        id: task.id,
        title: task.description,
        start: new Date(task.finishDate),
        allDay: true,
    };

    calendar.addEvent(event);
    // const taskLi = document.createElement("li");
    // const leftDiv = document.createElement("div");
    // const creationTimeDiv = document.createElement("div");
    // const buttonsDiv = document.createElement("div");
    //
    // taskLi.classList.add("todo", `standard-todo`);
    // taskLi.setAttribute("id", task.id);
    // if (task.done) taskLi.classList.add("completed");
    //
    // leftDiv.classList.add("todo-left-div");
    // buttonsDiv.classList.add("todo-buttons-div");
    // creationTimeDiv.classList.add("creation-time");
    // creationTimeDiv.setAttribute("datetime", task.creationTime);
    //
    // const newTask = document.createElement("div");
    // const newPriority = document.createElement("div");
    // const newFinishDate = document.createElement("div");
    //
    // newTask.innerText = task.description;
    // newTask.classList.add("todo-item");
    // newTask.classList.add("todo-item-description");
    // leftDiv.appendChild(newTask);
    //
    // creationTimeDiv.innerText = getDate(task.creationTime) + " " + getTime(task.creationTime);
    // leftDiv.appendChild(creationTimeDiv);
    // taskLi.appendChild(leftDiv);
    //
    // newPriority.innerText = task.priority.name;
    // newPriority.classList.add("todo-item");
    // newPriority.classList.add("todo-item-priority");
    // taskLi.appendChild(newPriority);
    //
    // newFinishDate.innerText = getDate(task.finishDate);
    // newFinishDate.classList.add("todo-item");
    // taskLi.appendChild(newFinishDate);
    //
    // const editButton = document.createElement("button");
    // editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>\n';
    // editButton.classList.add("edit-btn", `standard-button`);
    // editButton.addEventListener("click", editTask);
    // buttonsDiv.appendChild(editButton);
    //
    // const checkedButton = document.createElement("button");
    // checkedButton.innerHTML = '<i class="fas fa-check"></i>';
    // checkedButton.classList.add("check-btn", `standard-button`);
    // checkedButton.addEventListener("click", checkTask);
    // buttonsDiv.appendChild(checkedButton);
    //
    // const deleteButton = document.createElement("button");
    // deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    // deleteButton.classList.add("delete-btn", `standard-button`);
    // deleteButton.addEventListener("click", deleteTaskFromDB);
    // buttonsDiv.appendChild(deleteButton);
    //
    // const subtasksButton = document.createElement("button");
    // subtasksButton.innerHTML = 'S';
    // subtasksButton.classList.add("subtasks-btn", `standard-button`);
    // subtasksButton.addEventListener("click", getSubtasksPage);
    // buttonsDiv.appendChild(subtasksButton);
    //
    // taskLi.appendChild(buttonsDiv);
    // toDoList.appendChild(taskLi);
}

function getDate(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
    const day = date
        .getDate()
        .toString()
        .padStart(2, "0");

    return `${day}.${month}.${year}`;
}

function getTime(timestamp) {
    const date = new Date(timestamp);

    const hours = date
        .getHours()
        .toString()
        .padStart(2, "0");
    const minutes = date
        .getMinutes()
        .toString()
        .padStart(2, "0");

    return `${hours}:${minutes}`;
}

function editTask() {
    showEditTaskMenu(this.closest("li"));
}

function showEditTaskMenu(taskLiItem) {
    const taskId = taskLiItem.getAttribute("id");
    const description = taskLiItem.querySelector('.todo-item-description').textContent;
    const priority = taskLiItem.querySelector('.todo-item-priority').textContent;
    const finishDate = taskLiItem.querySelector('.todo-buttons-div').previousElementSibling.textContent;

    const form = document.getElementById("form");
    form.setAttribute("task-id", taskId);

    const descriptionField = document.getElementById('description');
    descriptionField.value = description;
    descriptionField.placeholder = "Edit the task.";

    const prioritySelect = document.getElementById('priority');
    prioritySelect.value = priority === 'High' ? '1' : priority === 'Medium' ? '2' : '3';

    const [day, month, year] = finishDate.split('.');
    document.getElementById('finishDate').value = `${year}-${month}-${day}`;
    document.querySelector('.todo-btn').textContent = "Edit Task!";

    form.method = "put";

    document
        .getElementById("form")
        .removeEventListener("submit", addTaskToDB);

    document
        .getElementById("form")
        .addEventListener("submit", editTaskInDB);
    clearChildren('.sort-buttons');
    clearChildren('.todo-list');
}

export function clearForm(form) {
    form.description.value = '';
    form.finishDate.value = '';
    form.priority.value = 1;
}