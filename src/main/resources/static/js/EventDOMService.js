export class EventDOMService {
    popUpWindowDOMService;
    backendService;
    editButtonsDiv;

    constructor(popUpWindowDOMService, backendService) {
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.backendService = backendService;
        this.createEditButtons(this.popUpWindowDOMService.getPopUpWindow());
    }

    createEditButtons(destination) {
        this.editButtonsDiv = document.createElement("div");
        this.editButtonsDiv.classList.add("edit-buttons-div");
        // this.createButton('<i class="fa-solid fa-pencil"></i>\n', editTask);
        // this.createButton('<i class="fas fa-check"></i>', checkTask);
        // this.createButton('<i class="fas fa-trash"></i>', deleteTaskFromDB);
        // this.createButton('S', getSubtasksPage);
        this.createButton('<i class="fa-solid fa-pencil"></i>\n');
        this.createButton('<i class="fas fa-check"></i>');
        this.createButton('<i class="fas fa-trash"></i>');
        this.createButton('S');
        // const editButton = document.createElement("button");
        // editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>\n';
        // editButton.classList.add("edit-btn", `standard-button`);
        // editButton.addEventListener("click", editTask);
        // this.editButtonsDiv.appendChild(editButton);

        // const checkedButton = document.createElement("button");
        // checkedButton.innerHTML = '<i class="fas fa-check"></i>';
        // checkedButton.classList.add("check-btn", `standard-button`);
        // checkedButton.addEventListener("click", checkTask);
        // this.editButtonsDiv.appendChild(checkedButton);
        //
        // const deleteButton = document.createElement("button");
        // deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        // deleteButton.classList.add("delete-btn", `standard-button`);
        // deleteButton.addEventListener("click", deleteTaskFromDB);
        // this.editButtonsDiv.appendChild(deleteButton);
        //
        // const subtasksButton = document.createElement("button");
        // subtasksButton.innerHTML = 'S';
        // subtasksButton.classList.add("subtasks-btn", `standard-button`);
        // subtasksButton.addEventListener("click", getSubtasksPage);
        // this.editButtonsDiv.appendChild(subtasksButton);

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
}