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
        const checkHandler = this.checkSubtask.bind(this);
        const deleteHandler = this.deleteSubtaskFromDB.bind(this);
        this.subtaskDOMService.displaySubtasks(subtasks, checkHandler, deleteHandler);
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


    //PATCH
    async checkSubtask(subtaskId, subtaskDataForPatch) {
        try {
            await this.subtaskBackendService.patchSubtask(subtaskId, subtaskDataForPatch);
            await this.loadSubtasks();
        } catch (err) {
            console.log(err);
        }
    }
}