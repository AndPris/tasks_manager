import {clearChildren} from "utilDOMFunctions.js";

export class SubtaskFormDOMService {
    form;

    constructor(form) {
        this.form = form;
    }

    getSubtaskData() {
        return {
            description: this.form.description.value,
            duration: this.form.duration.value,
            done: false,
            previousSubtasks: Array.from(this.form["previous-subtasks"].selectedOptions).map(({ value }) => {return {id: value}})
        }
    }

    clearSubtasksForm() {
        this.form.description.value = ''
        this.form.duration.value = ''
    }

    populatePossiblePreviousSubtasks(subtasks) {
        clearChildren(this.form["previous-subtasks"]);
        subtasks.forEach((subtask) => {this.form["previous-subtasks"].appendChild(this.getPreviousSubtaskOption(subtask))});
    }

    getPreviousSubtaskOption(subtask) {
        const option = document.createElement("option");
        option.value = subtask.id;
        option.textContent = subtask.description;
        return option;
    }


    async showEditSubtaskMenu(subtask) {
        const subtaskId = subtask.id;
        this.form.setAttribute("subtask-id", subtaskId);

        const descriptionField = this.form["description"];
        descriptionField.value = subtask.description;
        descriptionField.placeholder = "Edit the subtask.";

        this.form['duration'].value = subtask.duration;
        this.form['submit-button'].textContent = "Edit Subtask!";

        const selectElement = this.form['previous-subtasks'];
        const valuesToSelect = subtask.previousSubtasks.map((subtask) => Number(subtask.id));
        // await removeImpossiblePreviousSubtasksOptions(selectElement, subtaskId);
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