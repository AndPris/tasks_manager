export class SubtaskController {
    subtaskBackendService;
    subtaskDOMService;
    paginationButtonsDOMService;

    constructor(subtaskBackendService, subtaskDOMService, paginationButtonsDOMService) {
        this.subtaskBackendService = subtaskBackendService;
        this.subtaskDOMService = subtaskDOMService;
        this.paginationButtonsDOMService = paginationButtonsDOMService;
    }


    //GET
    async loadSubtasks() {
        let [subtasks, pageInfo] = await this.subtaskBackendService.loadSubtasks();
        const deleteHandler = this.deleteSubtaskFromDB.bind(this);
        this.subtaskDOMService.displaySubtasks(subtasks, deleteHandler);
        await this.populatePossiblePreviousSubtasks();
        this.paginationButtonsDOMService.updatePaginationButtons(pageInfo);
    }

    async populatePossiblePreviousSubtasks() {
        const subtasks = await this.subtaskBackendService.getAllSubtasks();
        this.subtaskDOMService.populatePossiblePreviousSubtasks(subtasks);
    }

    async goForward() {
        this.subtaskBackendService.nextPage();
        await this.loadSubtasks()
    }

    async goBackward() {
        this.subtaskBackendService.previousPage();
        await this.loadSubtasks()
    }


    //DELETE
    async deleteSubtaskFromDB(subtaskId) {
        try {
            await this.subtaskBackendService.deleteSubtask(subtaskId);
            await this.loadSubtasks();
        } catch (err) {
            console.log(err);
        }
    }
}