export class BackendService {
    baseURL = "/api/tasks";
    defaultNetworkErrorMessage = "Network response was not ok";

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

        const data = await response.json();
        console.log(data);
        return data;
    }
}