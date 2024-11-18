export class PopUpWindowDOMService {
    popUpWindow;
    headerParagraph;

    constructor() {
        this.createPopUpWindow();
        this.hidePopUpWindow();
    }

    hidePopUpWindow() {
        this.popUpWindow.style.display = "none";
    }

    displayPopUpWindow(headerParagraphText) {
        this.headerParagraph.textContent = headerParagraphText;
        this.popUpWindow.style.display = "flex";
    }

    createPopUpWindow() {
        const body = document.getElementById("body");
        this.popUpWindow = document.createElement("div");
        this.popUpWindow.classList.add("pop-up-window");

        this.headerParagraph = document.createElement("p");
        this.headerParagraph.classList.add("pop-up-window-header-p");
        this.popUpWindow.appendChild(this.headerParagraph);

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