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

    async getAllSubtasksWithIdLessThan(id) {
        const [subtasks, pageInfo] = await this.getSubtasks(`?all=true&lessThanSubtaskId=${id}`);
        return subtasks;
    }

    async fetchSubtask(subtaskId) {
        const response = await fetch(`/api/subtasks/${subtaskId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        return await response.json();
    }

    //DELETE
    async deleteSubtask(subtaskId) {
        let response = await fetch(`/api/subtasks/${subtaskId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);
    }


    //PATCH
    async patchSubtask(subtaskId, data) {
        let response = await fetch(`/api/subtasks/${subtaskId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
            body: JSON.stringify(data),
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);
    }


    //POST
    async postSubtask(subtaskData) {
        let response = await fetch(this.baseURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
            body: JSON.stringify(subtaskData),
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);
    }


    //PUT
    async putSubtask(subtaskId, data) {
        let response = await fetch(`${this.baseURL}/${subtaskId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
            body: JSON.stringify(data),
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);
    }


    //PLAN
    async getDataForGraph() {
        const response = await fetch(`/api/tasks/plan/${this.taskId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        return await response.json();
    }
}