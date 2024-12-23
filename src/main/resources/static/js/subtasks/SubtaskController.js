export class SubtaskController {
    subtaskBackendService;
    subtaskDOMService;
    paginationButtonsDOMService;
    subtaskFormDOMService;
    graph;
    planButtonDOMService;
    postHandler;
    putHandler;

    constructor(subtaskBackendService, subtaskDOMService,
                paginationButtonsDOMService, subtaskFormDOMService,
                graph, planButtonDOMService) {
        this.subtaskBackendService = subtaskBackendService;
        this.subtaskDOMService = subtaskDOMService;
        this.paginationButtonsDOMService = paginationButtonsDOMService;
        this.subtaskFormDOMService = subtaskFormDOMService;
        this.graph = graph;
        this.planButtonDOMService = planButtonDOMService;

        this.postHandler = this.addSubtaskToDB.bind(this);
        this.putHandler = this.editSubtaskInDB.bind(this);
    }

    getPostHandler() {
        return this.postHandler;
    }

    //GET
    async loadSubtasks() {
        let [subtasks, pageInfo] = await this.subtaskBackendService.loadSubtasks();
        if(subtasks.length === 0)
            this.planButtonDOMService.hidePlanButton();
        else
            this.planButtonDOMService.showPlanButton();

        const editHandler = this.editSubtask.bind(this);
        const checkHandler = this.checkSubtask.bind(this);
        const deleteHandler = this.deleteSubtaskFromDB.bind(this);
        this.subtaskDOMService.displaySubtasks(subtasks, editHandler, checkHandler, deleteHandler);

        await this.populatePossiblePreviousSubtasks();
        this.paginationButtonsDOMService.updatePaginationButtons(pageInfo);
    }

    async populatePossiblePreviousSubtasks() {
        const subtasks = await this.subtaskBackendService.getAllSubtasks();
        this.subtaskFormDOMService.setAllSubtasks(subtasks);
        this.subtaskFormDOMService.populatePossiblePreviousSubtasks(subtasks);
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


    //POST
    async addSubtaskToDB(event) {
        event.preventDefault();

        if(!this.subtaskFormDOMService.isSelectedPreviousSubtasksCorrect(await this.subtaskBackendService.getAllSubtasks()))
            return;

        const subtaskData = this.subtaskFormDOMService.getSubtaskData();
        try {
            await this.subtaskBackendService.postSubtask(subtaskData);
            this.subtaskFormDOMService.clearSubtasksForm();
            await this.loadSubtasks();
        } catch (err) {
            console.log(err);
        }
    }


    //PUT
    async editSubtask(subtaskLi) {
        const subtaskId = subtaskLi.getAttribute("id");
        const subtask = await this.subtaskBackendService.fetchSubtask(subtaskId);
        const possiblePreviousSubtasks = await this.subtaskBackendService.getAllSubtasksWithIdLessThan(subtaskId);

        this.subtaskFormDOMService.populatePossiblePreviousSubtasks(possiblePreviousSubtasks);
        this.subtaskFormDOMService.showEditSubtaskMenu(subtask);
        this.subtaskFormDOMService.removePostHandler(this.postHandler);
        this.subtaskFormDOMService.addPutHandler(this.putHandler);
        this.paginationButtonsDOMService.hidePaginationButtons();
        this.planButtonDOMService.hidePlanButton();
    }

    async editSubtaskInDB(event) {
        event.preventDefault();

        if(!this.subtaskFormDOMService.isSelectedPreviousSubtasksCorrect(await this.subtaskBackendService.getAllSubtasks()))
            return;

        try {
            await this.subtaskBackendService.putSubtask(this.subtaskFormDOMService.getSubtaskIdToEdit(),
                                                        this.subtaskFormDOMService.getSubtaskData());
            window.location.reload();
        } catch (err) {
            console.log(err);
        }

    }

    //PLAN
    async plan(earliestPossibleStartTime, finishDate, destination) {
        const data = await this.subtaskBackendService.getDataForGraph();
        console.log(data);
        this.graph.draw(data, earliestPossibleStartTime, finishDate, destination);
    }
}