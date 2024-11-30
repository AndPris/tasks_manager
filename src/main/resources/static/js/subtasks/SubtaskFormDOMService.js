import {clearChildren} from "utilDOMFunctions.js";

export class SubtaskFormDOMService {
    form;
    possiblePreviousSubtasks;
    previousSubtasksSelect;

    constructor(form) {
        this.form = form;
        this.previousSubtasksSelect = this.form["previous-subtasks"];
    }

    isSelectedPreviousSubtasksCorrect() {
        const selectedSubtasksIds = this.getSubtasksIdsFromSelectedOptions().map((element) => {return element.id});

        for(let subtaskId of selectedSubtasksIds) {
            if(this.isAncestorsSelected(subtaskId, selectedSubtasksIds)) {
                const subtask = this.getSubtaskById(subtaskId);
                console.log(subtask);
                alert(`You can not select subtask and its ancestors at the same time. Error caused by subtask '${subtask.description}' and it's previous subtasks.`);
                return false;
            }
        }

        return true;
    }

    isAncestorsSelected(currentSubtaskId, allSelectedSubtasksIds) {
        const currentSubtask = this.getSubtaskById(currentSubtaskId);

        for(let previousSubtask of currentSubtask.previousSubtasks) {
            const previousSubtaskId = previousSubtask.id;

            if(allSelectedSubtasksIds.includes(previousSubtaskId.toString()))
                return true;

            if(this.isAncestorsSelected(previousSubtaskId, allSelectedSubtasksIds))
                return true;
        }

        return false;
    }

    getSubtaskData() {
        return {
            description: this.form.description.value,
            duration: this.form.duration.value,
            done: false,
            previousSubtasks: this.getSubtasksIdsFromSelectedOptions()
        }
    }

    getSubtasksIdsFromSelectedOptions() {
        return Array.from(this.previousSubtasksSelect.selectedOptions).map(({ value }) => {return {id: value}})
    }

    getSubtasksFromSelectedOptions() {
        return Array.from(this.previousSubtasksSelect.selectedOptions).map(({ value }) => {
            return this.getSubtaskById(value);
        })
    }

    getSubtaskById(id) {
        return this.possiblePreviousSubtasks.find((subtask) => {
            return subtask.id.toString() === id.toString();
        });
    }

    clearSubtasksForm() {
        this.form.description.value = ''
        this.form.duration.value = ''
    }

    populatePossiblePreviousSubtasks(subtasks) {
        this.possiblePreviousSubtasks = subtasks;
        clearChildren(this.previousSubtasksSelect);
        subtasks.forEach((subtask) => {this.previousSubtasksSelect.appendChild(this.getPreviousSubtaskOption(subtask))});
    }

    getPreviousSubtaskOption(subtask) {
        const option = document.createElement("option");
        option.value = subtask.id;
        option.textContent = subtask.description;
        return option;
    }


    showEditSubtaskMenu(subtask) {
        const subtaskId = subtask.id;
        this.form.setAttribute("subtask-id", subtaskId);

        const descriptionField = this.form["description"];
        descriptionField.value = subtask.description;
        descriptionField.placeholder = "Edit the subtask.";

        this.form['duration'].value = subtask.duration;
        this.form['submit-button'].textContent = "Edit Subtask!";

        const selectElement = this.form['previous-subtasks'];
        const valuesToSelect = subtask.previousSubtasks.map((subtask) => Number(subtask.id));
        for (let option of selectElement.options) {
            if (valuesToSelect.includes(Number(option.value))) {
                option.selected = true;
            }
        }

        this.form.method = "put";
        clearChildren(document.getElementById("subtasks-container"));
    }

    removePostHandler(handler) {
        this.form.removeEventListener("submit", handler);
    }

    addPutHandler(handler) {
        this.form.addEventListener("submit", handler);
    }

    getSubtaskIdToEdit() {
        return this.form.getAttribute("subtask-id");
    }
}