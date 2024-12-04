import {clearChildren} from "utilDOMFunctions.js";

export class SubtaskFormDOMService {
    form;
    possiblePreviousSubtasks;
    previousSubtasksSelect;
    allSubtasks;

    constructor(form) {
        this.form = form;
        this.previousSubtasksSelect = this.form["previous-subtasks"];
    }

    setAllSubtasks(allSubtasks) {
        this.allSubtasks = allSubtasks;
    }

    isSelectedPreviousSubtasksCorrect(allSubtasks) {
        const selectedSubtasksIds = this.getSubtasksIdsFromSelectedOptions().map((element) => {return element.id});

        for(let selectedSubtaskId of selectedSubtasksIds) {
            if(this.isAncestorsSelected(selectedSubtaskId, selectedSubtasksIds)) {
                const subtask = this.getSubtaskById(selectedSubtaskId);
                alert(`You can not select subtask and its ancestors at the same time. Error caused by subtask '${subtask.description}' and it's previous subtasks.`);
                return false;
            }

            if(this.form.getAttribute("subtask-id") === null)
                continue;

            for(let subtask of allSubtasks) {
                if(!this.hasAncestor(subtask, this.form.getAttribute("subtask-id")))
                    continue;

                const previousSubtasksIds = subtask.previousSubtasks.map((subtask) => {return subtask.id.toString()});

                if(previousSubtasksIds.includes(selectedSubtaskId.toString()) || this.isAncestorsSelected(selectedSubtaskId, previousSubtasksIds)) {
                    const errorSubtask = this.getSubtaskById(selectedSubtaskId);
                    alert(`You can not select subtask and its ancestors at the same time. Error caused by subtask '${errorSubtask.description}' and it's previous subtasks.`);
                    return false;
                }
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

    hasAncestor(subtask, potentialAncestorId) {
        for(let previousSubtask of subtask.previousSubtasks) {
            const previousSubtaskId = previousSubtask.id;

            if(previousSubtaskId.toString() === potentialAncestorId.toString())
                return true;

            previousSubtask = this.getSubtaskById(previousSubtaskId);
            if(this.hasAncestor(previousSubtask, potentialAncestorId))
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
        return this.allSubtasks.find((subtask) => {
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