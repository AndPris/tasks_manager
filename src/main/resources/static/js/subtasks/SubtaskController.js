export class SubtaskController {
    subtaskBackendService;
    subtaskDOMService;
    paginationButtonsDOMService;

    constructor(subtaskBackendService, subtaskDOMService, paginationButtonsDOMService) {
        this.subtaskBackendService = subtaskBackendService;
        this.subtaskDOMService = subtaskDOMService;
        this.paginationButtonsDOMService = paginationButtonsDOMService;
    }

    async loadSubtasks() {
        let [subtasks, pageInfo] = await this.subtaskBackendService.loadSubtasks();
        this.subtaskDOMService.displaySubtasks(subtasks);
        this.paginationButtonsDOMService.updatePaginationButtons(pageInfo);
    }
}