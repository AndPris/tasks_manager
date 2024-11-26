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
}