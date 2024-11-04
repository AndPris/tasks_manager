import {loadSubtasks, goForward, goBackward, addSubtaskToDB} from 'subtasks.js';

document
    .getElementById("form")
    .addEventListener("submit", addSubtaskToDB);

await loadSubtasks();

window.goForward = goForward;
window.goBackward = goBackward;