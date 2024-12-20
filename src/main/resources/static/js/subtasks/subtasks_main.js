import {SubtaskBackendService} from "SubtaskBackendService.js";
import {SubtaskDOMService} from "SubtaskDOMService.js";
import {SubtaskFormDOMService} from "SubtaskFormDOMService.js";
import {PaginationButtonsDOMService} from "PaginationButtonsDOMService.js";
import {SubtaskController} from "SubtaskController.js";
import {Graph} from "graph.js";
import {PlanButtonDOMService} from "PlanButtonDOMService.js";

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

const subtaskBackendService = new SubtaskBackendService(taskId, csrfHeader, csrfToken);
const subtaskDOMService = new SubtaskDOMService(document.getElementById("subtasks-container"));
const paginationButtonsDOMService = new PaginationButtonsDOMService(document.getElementById("backward-button"),
                                                                document.getElementById("forward-button"));
const subtaskFormDOMService = new SubtaskFormDOMService(document.getElementById("form"));
const graph = new Graph();
const planButtonDOMService = new PlanButtonDOMService(document.getElementById("plan-button"),);

const subtaskController = new SubtaskController(subtaskBackendService, subtaskDOMService,
                                                                paginationButtonsDOMService, subtaskFormDOMService,
                                                                graph, planButtonDOMService);

await subtaskController.loadSubtasks();

document
    .getElementById("form")
    .addEventListener("submit", subtaskController.getPostHandler());

window.goForward = subtaskController.goForward.bind(subtaskController);
window.goBackward = subtaskController.goBackward.bind(subtaskController);

const planHandler = async () => {
    await subtaskController.plan(earliestPossibleStartTime, finishDate, document.getElementById("timeGraph"));
}
window.plan = planHandler;