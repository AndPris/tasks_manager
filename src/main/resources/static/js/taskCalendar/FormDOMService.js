export class FormDOMService {
    date;
    form;
    submitButton;
    eventToEdit;
    putHandler;
    allDay;
    postHandler;

    setPostHandler(postHandler) {
        this.postHandler = postHandler;
    }

    setPutHandler(putHandler) {
        this.putHandler = putHandler;
    }

    setAllDay(allDay) {
        this.allDay = allDay;
    }

    setDate(date) {
        this.date = date;
    }

    displayForm() {
        this.form.style.display = "flex";
    }

    hideForm() {
        this.form.style.display = "none";
    }

    createForm(destination) {
        this.form = document.createElement("form");
        this.form.classList.add("taskForm");

        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.name = "description";
        descriptionInput.placeholder = "Add a task.";
        descriptionInput.minLength = 1;
        descriptionInput.maxLength = 30;
        this.form.appendChild(descriptionInput);

        const prioritySelect = document.createElement("select");
        prioritySelect.required = true;
        prioritySelect.name = "priority";
        this.createPriorityOptions(prioritySelect);
        this.form.appendChild(prioritySelect);

        this.submitButton = document.createElement("button");
        this.submitButton.id = "submitButton";
        this.submitButton.type = "submit";
        this.submitButton.textContent = "Add Task!";
        this.form.appendChild(this.submitButton);

        this.form.addEventListener("submit", this.postHandler);

        destination.appendChild(this.form);
    }

    createPriorityOptions(prioritySelect) {
        const high = document.createElement("option");
        high.value = "1";
        high.textContent = "High"
        prioritySelect.appendChild(high);

        const medium = document.createElement("option");
        medium.value = "2";
        medium.textContent = "Medium"
        prioritySelect.appendChild(medium);

        const low = document.createElement("option");
        low.value = "3";
        low.textContent = "Low"
        prioritySelect.appendChild(low);
    }

    getFormData() {
        return {
            description: this.form.description.value,
            finishDate: this.date,
            allDay: this.allDay,
            priority: {id: this.form.priority.value}
        };
    }

    clearForm() {
        this.form.description.value = '';
        this.form.priority.value = 1;
    }

    changeToCreateForm() {
        this.form.removeAttribute("task-id");
        this.form.description.placeholder = "Add a task.";
        this.submitButton.textContent = "Add Task!";
        this.form.method = "post";

        this.form.removeEventListener("submit", this.putHandler);
        this.form.addEventListener("submit", this.postHandler);
    }

    changeToEditForm(event) {
        this.eventToEdit = event;
        this.form.setAttribute("task-id", event.id);

        this.form.description.value = event.title;
        this.form.description.placeholder = "Edit the task.";
        this.form.priority.value = this.getPriorityValueByName(event.extendedProps.priority);
        this.submitButton.textContent = "Edit Task!";

        this.form.method = "put";
        this.form.removeEventListener("submit", this.postHandler);
        this.form.addEventListener("submit", this.putHandler);
    }

    getPriorityValueByName(name) {
        for (let i = 0; i < this.form.priority.options.length; i++) {
            if (this.form.priority.options[i].textContent === name)
                return i+1;
        }
    }

    getTaskDataForPut() {
        let data = this.getFormData();
        data.finishDate = this.eventToEdit.startStr;
        return data;
    }
}