export class PopUpWindowDOMService {
    popUpWindow;
    header;

    constructor() {
        this.createPopUpWindow();
        this.hidePopUpWindow();
    }

    hidePopUpWindow() {
        this.popUpWindow.style.display = "none";
    }

    displayPopUpWindow(headerText) {
        this.header.textContent = headerText;
        this.popUpWindow.style.display = "flex";
    }

    createPopUpWindow() {
        const body = document.getElementById("body");
        this.popUpWindow = document.createElement("div");
        this.popUpWindow.classList.add("pop-up-window");

        this.header = document.createElement("p");
        this.header.classList.add("pop-up-window-header");
        this.popUpWindow.appendChild(this.header);

        this.createCloseButton();
        body.appendChild(this.popUpWindow);
    }

    createCloseButton() {
        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.classList.add("closeButton");
        closeButton.addEventListener("click", () => {this.hidePopUpWindow()});
        this.popUpWindow.appendChild(closeButton);
    }

    getPopUpWindow() {
        return this.popUpWindow;
    }
}