import {loadSubtasks, goForward, goBackward, addSubtaskToDB, plan} from 'subtasks.js';

document
    .getElementById("form")
    .addEventListener("submit", addSubtaskToDB);

await loadSubtasks();

window.goForward = goForward;
window.goBackward = goBackward;
window.plan = plan;