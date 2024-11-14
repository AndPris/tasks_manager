import {addTaskToDB, checkTask, deleteTaskFromDB, editTaskInDB, getSubtasksPage} from "backend_interaction.js";

export function displayTasks(tasks) {
    console.log(tasks);
    const calendar = window.calendarInstance;
    calendar.removeAllEvents();
    tasks.forEach((task) => {
        console.log(task);
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
        done: task.done,
        allDay: true,
        color: getTaskColor(task),
        classNames: getClassNames(task),
    };

    calendar.addEvent(event);
}

function getTaskColor(task) {
    if(task.done)
        return 'gray';

    let color;
    switch (task.priority.name.toLowerCase()) {
        case 'high':
            color = 'red';
            break;
        case 'low':
            color = 'green';
            break;
        default:
            color = 'blue';
    }
    return color;
}

function getClassNames(task) {
    if(task.done)
        return 'task-done';
    return '';
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