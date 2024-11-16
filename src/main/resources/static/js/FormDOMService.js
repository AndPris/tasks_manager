export class FormDOMService {
    date;
    form;
    backendService;
    taskDOMService;
    popUpWindowDOMService;

    constructor(popUpWindowDOMService, backendService) {
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.backendService = backendService;
        this.createForm(this.popUpWindowDOMService.getPopUpWindow());
    }

    setTaskDOMService(taskDOMService) {
        this.taskDOMService = taskDOMService;
    }

    displayFormOnPopUpWindow(date) {
        this.date = date;
        this.popUpWindowDOMService.displayPopUpWindow(`Selected Date: ${date}`);
        this.displayForm();
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

        const submitButton = document.createElement("button");
        submitButton.id = "submitButton";
        submitButton.type = "submit";
        submitButton.textContent = "Add Task!";
        this.form.appendChild(submitButton);

        this.form.addEventListener("submit", this.createTask.bind(this));

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

    async createTask(event) {
        event.preventDefault();
        await this.backendService.postTask(this.getFormData());
        this.taskDOMService.displayTasks(await this.backendService.loadTasks());
        this.clearForm();
    }

    getFormData() {
        return {
            description: this.form.description.value,
            finishDate: this.date,
            priority: {id: this.form.priority.value}
        };
    }

    clearForm() {
        this.form.description.value = '';
        this.form.priority.value = 1;
    }
}