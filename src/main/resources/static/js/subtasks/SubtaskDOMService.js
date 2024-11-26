export class SubtaskDOMService {
    subtasksContainer;
    previousSubtasksSelect;

    constructor(subtasksContainer, previousSubtasksSelect) {
        this.subtasksContainer = subtasksContainer;
        this.previousSubtasksSelect = previousSubtasksSelect;
    }

    displaySubtasks(subtasks, checkHandler, deleteHandler) {
        this.clearChildren(this.subtasksContainer);
        this.clearChildren(this.previousSubtasksSelect);
        subtasks.forEach((subtask) => {this.displaySubtask(subtask, checkHandler, deleteHandler)});
    }

    clearChildren(element) {
        while (element.firstChild)
            element.removeChild(element.firstChild);
    }

    displaySubtask(subtask, checkHandler, deleteHandler) {
        const subtaskLi = document.createElement("li");
        const descriptionDiv = document.createElement("div");
        const buttonsDiv = document.createElement("div");

        subtaskLi.classList.add("subtask");
        subtaskLi.setAttribute("id", subtask.id);
        if (subtask.done)
            subtaskLi.classList.add("completed");

        descriptionDiv.classList.add("subtask-left-div");
        buttonsDiv.classList.add("subtask-buttons-div");

        const description = document.createElement("div");
        const duration = document.createElement("div");

        description.innerText = subtask.description;
        description.classList.add("subtask-div");
        description.classList.add("subtask-description");
        descriptionDiv.appendChild(description);

        if(this.hasPreviousSubtasks(subtask))
            this.displayPreviousSubtasks(subtask, descriptionDiv);

        subtaskLi.appendChild(descriptionDiv);

        duration.innerText = subtask.duration;
        duration.classList.add("subtask-div");
        subtaskLi.appendChild(duration);

        // buttonsDiv.appendChild(this.createButton('<i class="fa-solid fa-pencil"></i>', editSubtask));
        // buttonsDiv.appendChild(this.createButton('<i class="fas fa-check"></i>', checkSubtask));
        // buttonsDiv.appendChild(this.createButton('<i class="fas fa-trash"></i>', deleteSubtaskFromDB));
        buttonsDiv.appendChild(this.createButton('<i class="fa-solid fa-pencil"></i>'));

        const checkButton = this.createButton('<i class="fas fa-check"></i>');
        checkButton.addEventListener("click", (event) => {
            checkHandler(subtask.id, this.getSubtaskDataForPatch(subtask));
        });
        buttonsDiv.appendChild(checkButton);

        const deleteButton = this.createButton('<i class="fas fa-trash"></i>');
        deleteButton.addEventListener("click", (event) => {
            deleteHandler(subtask.id);
        });
        buttonsDiv.appendChild(deleteButton);

        subtaskLi.appendChild(buttonsDiv);
        this.subtasksContainer.appendChild(subtaskLi);
    }

    hasPreviousSubtasks(subtask) {
        return subtask.previousSubtasks.length !== 0;
    }

    displayPreviousSubtasks(subtask, destination) {
        const previousSubtasksDiv = document.createElement("div");
        previousSubtasksDiv.classList.add("previous-subtasks");

        let content = "Previous subtasks: ";
        subtask.previousSubtasks.sort((a, b) => {return a.id - b.id}).forEach((previousSubtask) => content += previousSubtask.description + ", ");
        content = content.substring(0, content.length-2);
        previousSubtasksDiv.textContent = content;

        destination.appendChild(previousSubtasksDiv);
    }

    createButton(innerHTML) {
        const button = document.createElement("button");
        button.innerHTML = innerHTML;
        button.classList.add("action-button");
        return button;
    }

    getSubtaskDataForPatch(subtask) {
        return {
            done: !subtask.done
        };
    }

    async populatePossiblePreviousSubtasks(subtasks) {
        subtasks.forEach((subtask) => {this.previousSubtasksSelect.appendChild(this.getPreviousSubtaskOption(subtask))});
    }

    getPreviousSubtaskOption(subtask) {
        const option = document.createElement("option");
        option.value = subtask.id;
        option.textContent = subtask.description;
        return option;
    }
}