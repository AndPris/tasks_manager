export class EventDOMService {
    popUpWindowDOMService;
    backendService;
    editButtonsDiv;
    info;
    isEventDone;
    taskDOMService;

    constructor(popUpWindowDOMService, backendService) {
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.backendService = backendService;
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

        this.createButton('<i class="fa-solid fa-pencil"></i>\n');
        this.createButton('<i class="fas fa-check"></i>', this.toggleTaskCheck.bind(this));
        this.createButton('<i class="fas fa-trash"></i>');
        this.createButton('S');

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
        };
    }

    async toggleTaskCheck() {
        this.taskDOMService.removeEvent(this.info.event);
        const newTask = await this.backendService.patchTask(this.info.event.id, this.getEventDataForTaskCheck());
        this.taskDOMService.displayTask(newTask);
        this.updateIsEventDone();
    }

    getEventDataForTaskCheck() {
        return  {
            done: !this.isEventDone,
        };
    }

    updateIsEventDone() {
        this.isEventDone = !this.isEventDone;
    }
}