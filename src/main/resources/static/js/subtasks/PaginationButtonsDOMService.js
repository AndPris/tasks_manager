export class PaginationButtonsDOMService {
    backwardButton;
    forwardButton;

    constructor(backwardButton, forwardButton) {
        this.backwardButton = backwardButton;
        this.forwardButton = forwardButton;
    }

    updatePaginationButtons(pageInfo) {
        let [currentPage, totalPages] = this.parsePageInfo(pageInfo);

        if(currentPage === 0)
            this.backwardButton.style.display = 'none';
        else
            this.backwardButton.style.display = '';

        if(currentPage+1 >= totalPages)
            this.forwardButton.style.display = 'none';
        else
            this.forwardButton.style.display = '';
    }

    parsePageInfo(pageInfo) {
        if(pageInfo)
            return [pageInfo.number, pageInfo.totalPages];
        else
            return [0, 1];
    }

    hidePaginationButtons() {
        this.backwardButton.style.display = "none";
        this.forwardButton.style.display = "none";
    }
}