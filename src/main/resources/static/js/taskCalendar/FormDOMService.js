export class FormDOMService {
    date;
    form;
    submitButton;
    backendService;
    taskDOMService;
    popUpWindowDOMService;
    eventToEdit;
    postTaskHandler;
    putTaskHandler;

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
        this.popUpWindowDOMService.displayPopUpWindow(`Selected Date: ${this.getClearDateString(date)}`);
        this.displayForm();
    }

    getClearDateString(date) {
        date = date.replace('T', ' ');

        const indexOfDelim = date.indexOf('+');
        if(indexOfDelim !== -1)
            date = date.slice(0, indexOfDelim);

        return date;
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

        this.postTaskHandler = this.createTask.bind(this);
        this.form.addEventListener("submit", this.postTaskHandler);

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
        let date = this.getUTCTime()
        console.log(date);
        return {
            description: this.form.description.value,
            finishDate: date,
            priority: {id: this.form.priority.value}
        };
    }

    getUTCTime() {
        let date = new Date(this.date);
        console.log("Offset", date.getTimezoneOffset() / 60);
        if(this.date.indexOf('+') === -1)
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60);

        return date.toISOString();
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

        this.form.removeEventListener("submit", this.putTaskHandler);
        this.form.addEventListener("submit", this.postTaskHandler);
    }

    changeToEditForm(event) {
        this.eventToEdit = event;
        this.form.setAttribute("task-id", event.id);

        this.form.description.value = event.title;
        this.form.description.placeholder = "Edit the task.";
        this.form.priority.value = this.getPriorityValueByName(event.extendedProps.priority);
        this.submitButton.textContent = "Edit Task!";

        this.form.method = "put";
        this.form.removeEventListener("submit", this.postTaskHandler);
        this.putTaskHandler = this.editTask.bind(this);
        this.form.addEventListener("submit", this.putTaskHandler);
    }

    getPriorityValueByName(name) {
        for (let i = 0; i < this.form.priority.options.length; i++) {
            if (this.form.priority.options[i].textContent === name)
                return i+1;
        }
    }

    async editTask(event) {
        event.preventDefault();
        console.log(this.getTaskDataForPut());
        this.taskDOMService.removeEvent( {id: this.eventToEdit.id,});
        const newTask = await this.backendService.putTask(this.eventToEdit.id, this.getTaskDataForPut());
        this.taskDOMService.displayTask(newTask);
        this.clearForm();
        this.changeToCreateForm();
        this.hideForm();
        this.popUpWindowDOMService.hidePopUpWindow();
    }

    getTaskDataForPut() {
        let data = this.getFormData();
        data.finishDate = this.eventToEdit.startStr;
        return data;
    }
}