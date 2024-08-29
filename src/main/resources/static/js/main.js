import {addTaskToDB, editTaskInDB, loadTasks, goForward, goBackward, sortTasksByFinishDate, sortTasksByPriority, findTask} from 'backend_interaction.js';

document
    .getElementById("form")
    .addEventListener("submit", addTaskToDB);


loadTasks();



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

async function editTask() {
    showEditTaskMenu(this.closest("li"));
}


window.sortTasksByPriority = sortTasksByPriority;
window.sortTasksByFinishDate = sortTasksByFinishDate;
window.findTask = findTask;
window.goForward = goForward;
window.goBackward = goBackward;