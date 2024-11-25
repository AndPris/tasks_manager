// import {loadSubtasks, goForward, goBackward, addSubtaskToDB, plan} from 'subtasks.js';

import {SubtaskBackendService} from "SubtaskBackendService.js";
import {SubtaskDOMService} from "SubtaskDOMService.js";
import {SubtaskController} from "SubtaskController.js";
import {Graph} from "graph.js";

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

const subtaskBackendService = new SubtaskBackendService(taskId, csrfHeader, csrfToken);
const subtaskDOMService = new SubtaskDOMService(document.getElementById("subtasks-container"),
                                                                document.getElementById("previous-subtasks"));
const subtaskController = new SubtaskController(subtaskBackendService, subtaskDOMService);

await subtaskController.loadSubtasks();

// document
//     .getElementById("form")
//     .addEventListener("submit", addSubtaskToDB);
//
// await loadSubtasks();
//
// window.goForward = goForward;
// window.goBackward = goBackward;
// window.plan = plan;