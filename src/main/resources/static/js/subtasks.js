import {loadTasks, updatePaginationButtons} from "backend_interaction.js";

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
const pageSize = 5;
let pageNumber = 0;
const baseURL = `/api/tasks/${taskId}/subtasks`;
const defaultNetworkErrorMessage = "Network response was not ok";

//GET
export async function loadSubtasks(queryString) {
    queryString = queryString ? queryString : getDefaultQueryString();
    console.log(queryString);
    try {
        let [subtasks, pageInfo] = await getSubtasks(queryString);
        console.log(subtasks);
        // displayTasks(tasks);
        updatePaginationButtons(pageInfo);
    } catch (err) {
        console.log(err);
    }
}

function getDefaultQueryString() {
    return `?page=${pageNumber}&size=${pageSize}&sort=done,asc&sort=id,asc`;
}

async function getSubtasks(queryString) {
    console.log("Query: " + `${baseURL}${queryString}`);
    const response = await fetch(`${baseURL}${queryString}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);

    const data = await response.json();
    console.log(data);
    console.log(data.page);
    return [data._embedded ? data._embedded.subtaskDTOes : [], data.page];
}

export async function goForward() {
    pageNumber += 1;
    await loadSubtasks()
}

export async function goBackward() {
    pageNumber -= 1;
    await loadSubtasks()
}



//POST
export async function addSubtaskToDB(event) {
    event.preventDefault();
    // const form = getForm(event);
    //
    // try {
    //     validateForm(form);
    // } catch (error) {
    //     alert(error);
    //     return;
    // }

    const subtaskData = getSubtaskDataForPost();

    try {
        await postSubtask(subtaskData);
        // clearForm(form);
        await loadSubtasks();
    } catch (err) {
        console.log(err);
    }
}

function getSubtaskDataForPost() {
    // return {
    //     "description": "Sample subtask without dependencies",
    //     "duration": 3,
    //     "done": false
    // }
    return {
        description: "Subtask with 2 dependencies",
        duration: 1,
        done: false,
        previousSubtasks: [{id: 1}, {id: 2}]
    }
}

async function postSubtask(subtaskData) {
    let response = await fetch(baseURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(subtaskData),
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}