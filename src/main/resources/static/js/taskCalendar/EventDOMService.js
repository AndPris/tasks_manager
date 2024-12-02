export class EventDOMService {
    editButtonsDiv;
    putHandler;
    checkHandler;
    deleteHandler;
    subtasksPageHandler;

    setPutHandler(putHandler) {
        this.putHandler = putHandler;
    }

    setCheckHandler(checkHandler) {
        this.checkHandler = checkHandler;
    }

    setDeleteHandler(deleteHandler) {
        this.deleteHandler = deleteHandler;
    }

    setSubtasksPageHandler(subtasksPageHandler) {
        this.subtasksPageHandler = subtasksPageHandler;
    }

    createEditButtons(destination) {
        this.editButtonsDiv = document.createElement("div");
        this.editButtonsDiv.classList.add("edit-buttons-div");

        // this.createButton('<i class="fa-solid fa-pencil"></i>\n', this.displayEditForm.bind(this));
        // this.createButton('S', this.getSubtasksPage.bind(this));
        this.createButton('<i class="fa-solid fa-pencil"></i>\n', this.displayEditForm.bind(this));
        this.createButton('<i class="fas fa-check"></i>', this.checkHandler);
        this.createButton('<i class="fas fa-trash"></i>', this.deleteHandler);
        this.createButton('S', this.subtasksPageHandler);

        destination.appendChild(this.editButtonsDiv);
    }

    createButton(innerHTML, onClick) {
        const button = document.createElement("button");
        button.innerHTML = innerHTML;
        button.classList.add("event-button", `standard-button`);
        button.addEventListener("click", onClick);
        this.editButtonsDiv.appendChild(button);
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

    displayEditForm() {
        this.formDOMService.changeToEditForm(this.info.event);
        this.hideEditButtons();
        this.formDOMService.displayForm();
    }
}