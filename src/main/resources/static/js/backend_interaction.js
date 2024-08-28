import {validateForm} from "data_validation.js";


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
    let response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok)
        throw new Error("Network response was not ok");
}
