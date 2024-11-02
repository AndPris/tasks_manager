import {loadSubtasks, goForward, goBackward} from 'subtasks.js';

// document
//     .getElementById("form")
//     .addEventListener("submit", addTaskToDB);

await loadSubtasks();

window.goForward = goForward;
window.goBackward = goBackward;