export class SubtaskController {
    subtaskBackendService;
    subtaskDOMService;

    constructor(subtaskBackendService, subtaskDOMService) {
        this.subtaskBackendService = subtaskBackendService;
        this.subtaskDOMService = subtaskDOMService;
    }

    async loadSubtasks() {
        let [subtasks, pageInfo] = await this.subtaskBackendService.loadSubtasks();
        console.log(subtasks);
        this.subtaskDOMService.displaySubtasks(subtasks);
    }
}