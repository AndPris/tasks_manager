export class SubtaskBackendService {
    taskId;
    baseURL;
    defaultNetworkErrorMessage = "Network response was not ok";
    csrfHeader;
    csrfToken;
    pageSize = 5;
    pageNumber;

    constructor(taskId, csrfHeader, csrfToken) {
        this.taskId = taskId;
        this.csrfHeader = csrfHeader;
        this.csrfToken = csrfToken;
        this.baseURL = `/api/tasks/${taskId}/subtasks`;
        this.pageNumber = 0;
    }

    nextPage() {
        this.pageNumber += 1;
    }

    previousPage() {
        this.pageNumber -= 1;
    }

    //GET
    async loadSubtasks(queryString) {
        queryString = queryString ? queryString : this.getDefaultQueryString();
        try {
            return await this.getSubtasks(queryString);
        } catch (err) {
            console.log(err);
        }
    }

    getDefaultQueryString() {
        return `?page=${this.pageNumber}&size=${this.pageSize}&sort=done,asc&sort=id,asc`;
    }

    async getSubtasks(queryString) {
        const response = await fetch(`${this.baseURL}${queryString}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        const data = await response.json();
        return [data._embedded ? data._embedded.subtaskDTOes : [], data.page];
    }

    async getAllSubtasks() {
        const [subtasks, pageInfo] = await this.getSubtasks('?all=true');
        return subtasks;
    }
}