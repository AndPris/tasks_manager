export class FormDOMService {
    date;
    form;
    formWindow;
    dateDisplay;
    backendService;
    taskDOMService;

    constructor(backendService) {
        this.createFormWindow();
        this.hideFormWindow();
        this.backendService = backendService;
    }

    setTaskDOMService(taskDOMService) {
        this.taskDOMService = taskDOMService;
    }

    hideFormWindow() {
        this.formWindow.style.display = "none";
    }

    displayFormWindow(date) {
        this.date = date;
        this.dateDisplay.textContent = `Selected Date: ${date}`;
        this.formWindow.style.display = "flex";
    }

    createFormWindow() {
        const body = document.getElementById("body");
        this.formWindow = document.createElement("div");
        this.formWindow.classList.add("formWindow");

        this.dateDisplay = document.createElement("p");
        this.dateDisplay.classList.add("date-display");
        this.formWindow.appendChild(this.dateDisplay);

        this.createForm();
        this.createCloseButton();
        body.appendChild(this.formWindow);
    }

    createCloseButton() {
        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.classList.add("closeButton");
        closeButton.addEventListener("click", () => {this.hideFormWindow()});
        this.formWindow.appendChild(closeButton);
    }

    createForm() {
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

        this.formWindow.appendChild(this.form);
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
    }

    getFormData() {
        return {
            description: this.form.description.value,
            finishDate: this.date,
            priority: {id: this.form.priority.value}
        };
    }
}