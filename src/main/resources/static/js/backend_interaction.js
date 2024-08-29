import {validateForm} from "data_validation.js";

const baseURL = "/api/tasks";

export async function addTaskToDB(event) {
    event.preventDefault();
    const form = event.target;

    try {
        validateForm(form);
    } catch (error) {
        alert(error);
        return;
    }

    const taskData = getTaskData(form);

    try {
        await postTask(taskData);
        window.location.reload();
    } catch (err) {
        console.log(err);
    }
}

function getTaskData(form) {
    return {
        description: form.description.value,
        finishDate: form.finishDate.value,
        priority: {id: form.priority.value}
    };
}

async function postTask(taskData) {
    let response = await fetch(baseURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok)
        throw new Error("Network response was not ok");
}


export async function deleteTaskFromDB() {
    try {
        await deleteTask(getTaskId(this));
        window.location.reload();
    } catch (err) {
        console.log(err);
    }
}

function getTaskId(element) {
    return element.closest("li").getAttribute("id");
}

async function deleteTask(taskId) {
    let response = await fetch(`${baseURL}/${taskId}`, {
        method: "DELETE",
    });

    if (!response.ok)
        throw new Error("Network response was not ok");
}