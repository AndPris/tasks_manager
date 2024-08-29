import {addTaskToDB, loadTasks, goForward, goBackward, sortTasksByFinishDate, sortTasksByPriority, findTask} from 'backend_interaction.js';

document
    .getElementById("form")
    .addEventListener("submit", addTaskToDB);

await loadTasks();

window.sortTasksByPriority = sortTasksByPriority;
window.sortTasksByFinishDate = sortTasksByFinishDate;
window.findTask = findTask;
window.goForward = goForward;
window.goBackward = goBackward;