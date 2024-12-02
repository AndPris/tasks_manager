export class EventDOMService {
    popUpWindowDOMService;
    backendService;
    editButtonsDiv;
    info;
    isEventDone;
    taskDOMService;
    formDOMService;

    constructor(popUpWindowDOMService, backendService, formDOMService) {
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.backendService = backendService;
        this.formDOMService = formDOMService;
        this.createEditButtons(this.popUpWindowDOMService.getPopUpWindow());
    }

    setInfo(info) {
       this.info = info;
       this.isEventDone = this.info.event.extendedProps.done;
    }

    setTaskDOMService(taskDOMService) {
        this.taskDOMService = taskDOMService;
    }

    createEditButtons(destination) {
        this.editButtonsDiv = document.createElement("div");
        this.editButtonsDiv.classList.add("edit-buttons-div");

        this.createButton('<i class="fa-solid fa-pencil"></i>\n', this.displayEditForm.bind(this));
        this.createButton('<i class="fas fa-check"></i>', this.toggleTaskCheck.bind(this));
        this.createButton('<i class="fas fa-trash"></i>', this.deleteTask.bind(this));
        this.createButton('S', this.getSubtasksPage.bind(this));

        destination.appendChild(this.editButtonsDiv);
    }

    createButton(innerHTML, onClick) {
        const button = document.createElement("button");
        button.innerHTML = innerHTML;
        button.classList.add("event-button", `standard-button`);
        button.addEventListener("click", onClick);
        this.editButtonsDiv.appendChild(button);
    }

    displayEditButtonsOnPopUpWindow(taskDescription) {
        this.popUpWindowDOMService.displayPopUpWindow(taskDescription);
        this.displayEditButtons();
    }

    displayEditButtons() {
        this.editButtonsDiv.style.display = "flex";
    }

    hideEditButtons() {
        this.editButtonsDiv.style.display = "none";
    }

    getEventDataDuringDragNDrop(info) {
        return  {
            finishDate: info.event.startStr,
            allDay: info.event.allDay,
        };
    }

    //PATCH
    async toggleTaskCheck() {
        this.taskDOMService.removeEvent(this.info.event);
        const newTask = await this.backendService.patchTask(this.getEventId(), this.getEventDataForTaskCheck());
        this.taskDOMService.displayTask(newTask);
        this.updateIsEventDone();
    }

    getEventId() {
        return this.info.event.id;
    }

    getEventDataForTaskCheck() {
        return  {
            done: !this.isEventDone,
        };
    }

    updateIsEventDone() {
        this.isEventDone = !this.isEventDone;
    }

    //DELETE
    async deleteTask() {
        this.taskDOMService.removeEvent(this.info.event);
        await this.backendService.deleteTask(this.getEventId());
        this.hideEditButtons();
        this.popUpWindowDOMService.hidePopUpWindow();
    }

    getSubtasksPage() {
        window.location.href = `/tasks/${this.getEventId()}/subtasks`;
    }

    displayEditForm() {
        this.formDOMService.changeToEditForm(this.info.event);
        this.hideEditButtons();
        this.formDOMService.displayForm();
    }
}