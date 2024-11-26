import {SubtaskBackendService} from "SubtaskBackendService.js";
import {SubtaskDOMService} from "SubtaskDOMService.js";
import {PaginationButtonsDOMService} from "PaginationButtonsDOMService.js";
import {SubtaskController} from "SubtaskController.js";
import {Graph} from "graph.js";

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

const subtaskBackendService = new SubtaskBackendService(taskId, csrfHeader, csrfToken);
const subtaskDOMService = new SubtaskDOMService(document.getElementById("subtasks-container"),
                                                                document.getElementById("previous-subtasks"));
const paginationButtonsDOMService = new PaginationButtonsDOMService(document.getElementById("backward-button"),
                                                                document.getElementById("forward-button"));

const subtaskController = new SubtaskController(subtaskBackendService, subtaskDOMService, paginationButtonsDOMService);

await subtaskController.loadSubtasks();

// document
//     .getElementById("form")
//     .addEventListener("submit", addSubtaskToDB);
//
// await loadSubtasks();
//
window.goForward = subtaskController.goForward.bind(subtaskController);
window.goBackward = subtaskController.goBackward.bind(subtaskController);
// window.plan = plan;