import {validateForm} from "data_validation.js";

const baseURL = "/api/tasks";
const defaultNetworkErrorMessage = "Network response was not ok";

//POST
export async function addTaskToDB(event) {
    event.preventDefault();
    const form = getForm(event);
    
    try {
        validateForm(form);
    } catch (error) {
        alert(error);
        return;
    }

    const taskData = getTaskDataForPost(form);

    try {
        await postTask(taskData);
        window.location.reload();
    } catch (err) {
        console.log(err);
    }
}

function getForm(event) {
    return event.target;
}

function getTaskDataForPost(form) {
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
        throw new Error(defaultNetworkErrorMessage);
}


//DELETE
export async function deleteTaskFromDB() {
    try {
        await deleteTask(getTaskId(this));
        window.location.reload();
    } catch (err) {
        console.log(err);
    }
}

function getTaskId(element) {
    return getTaskLi(element).getAttribute("id");
}

function getTaskLi(element) {
    return element.closest("li");
}

async function deleteTask(taskId) {
    let response = await fetch(`${baseURL}/${taskId}`, {
        method: "DELETE",
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}


//PATCH
export async function checkTask() {
    try {
        await patchTask(getTaskId(this), getTaskDataForPatch(this))
        window.location.reload();
    } catch (err) {
        console.log(err);
    }
}

function getTaskDataForPatch(element) {
    return {
        done: !getTaskLi(element).classList.contains('completed')
    };
}

async function patchTask(taskId, data) {
    let response = await fetch(`${baseURL}/${taskId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}


//PUT
export async function editTaskInDB(event) {
    event.preventDefault();

    try {
        await putTask(this.getAttribute("task-id"), getTaskDataForPut(getForm(event)));
        window.location.reload();
    } catch (err) {
        console.log(err);
    }

}

function getTaskDataForPut(form) {
    return  {
        description: form.description.value,
        finishDate: form.finishDate.value,
        priority: { id: form.priority.value }
    };
}

async function putTask(taskId, data) {
    let response = await fetch(`${baseURL}/${taskId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}