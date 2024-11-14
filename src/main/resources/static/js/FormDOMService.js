export class FormDOMService {
    date;
    formWindow;
    dateDisplay;

    constructor() {
        this.createFormWindow();
        this.hideFormWindow();
    }

    hideFormWindow() {
        this.formWindow.style.display = "none";
    }

    displayFormWindow(date) {
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
        const form = document.createElement("form");

        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.name = "description";
        descriptionInput.placeholder = "Add a task.";
        form.appendChild(descriptionInput);

        const prioritySelect = document.createElement("select");
        prioritySelect.name = "priority";
        this.createPriorityOptions(prioritySelect);
        form.appendChild(prioritySelect);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Add Task!";
        form.appendChild(submitButton);

        this.formWindow.appendChild(form);
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
}