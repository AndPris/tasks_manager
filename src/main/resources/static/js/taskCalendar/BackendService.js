export class BackendService {
    baseURL = "/api/tasks";
    defaultNetworkErrorMessage = "Network response was not ok";
    csrfHeader;
    csrfToken;

    constructor(csrfHeader, csrfToken) {
        this.csrfHeader = csrfHeader;
        this.csrfToken = csrfToken;
    }

    //GET
    async loadTasks() {
        try {
            return await this.getTasks();
        } catch (err) {
            console.log(err);
        }
    }

    async getTasks() {
        const response = await fetch(`${this.baseURL}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        return await response.json();
    }

    async loadSubtasks() {
        try {
            return await this.getSubtasks();
        } catch (err) {
            console.log(err);
        }
    }

    async getSubtasks() {
        const response = await fetch(`/api/subtasks`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        return await response.json();
    }


    //POST
    async postTask(taskData) {
        console.log(taskData);
        let response = await fetch(this.baseURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);
    }

    //PUT
    async putTask(taskId, newTaskData) {
        let response = await fetch(`${this.baseURL}/${taskId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
            body: JSON.stringify(newTaskData),
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        const data = await response.json();
        console.log(data);
        return data;
    }

    //PATCH
    async patchTask(taskId, newTaskData) {
        let response = await fetch(`${this.baseURL}/${taskId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
            body: JSON.stringify(newTaskData),
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);

        const data = await response.json();
        console.log(data);
        return data;
    }

    //DELETE
    async deleteTask(taskId) {
        let response = await fetch(`${this.baseURL}/${taskId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                [this.csrfHeader]: this.csrfToken
            },
        });

        if (!response.ok)
            throw new Error(this.defaultNetworkErrorMessage);
    }
}