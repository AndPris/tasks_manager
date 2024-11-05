import {checkTask, deleteTaskFromDB, getSubtasksPage, loadTasks, updatePaginationButtons} from "backend_interaction.js";
import {clearChildren} from "dom_interaction.js"

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
const pageSize = 5;
let pageNumber = 0;
const baseURL = `/api/tasks/${taskId}/subtasks`;
const defaultNetworkErrorMessage = "Network response was not ok";
const toDoList = document.querySelector(".todo-list");

//GET
export async function loadSubtasks(queryString) {
    queryString = queryString ? queryString : getDefaultQueryString();
    console.log(queryString);
    try {
        let [subtasks, pageInfo] = await getSubtasks(queryString);
        console.log(subtasks);
        displaySubtasks(subtasks);
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

function displaySubtasks(subtasks) {
    clearChildren(".todo-list");
    subtasks.forEach((subtask) => {displaySubtask(subtask)});
}

function displaySubtask(subtask) {
    const subtaskLi = document.createElement("li");
    const descriptionDiv = document.createElement("div");
    const buttonsDiv = document.createElement("div");

    subtaskLi.classList.add("todo", `standard-todo`);
    subtaskLi.setAttribute("id", subtask.id);
    if (subtask.done) subtaskLi.classList.add("completed");

    descriptionDiv.classList.add("todo-left-div");
    buttonsDiv.classList.add("todo-buttons-div");

    const description = document.createElement("div");
    const duration = document.createElement("div");

    description.innerText = subtask.description;
    description.classList.add("todo-item");
    description.classList.add("todo-item-description");
    descriptionDiv.appendChild(description);

    subtaskLi.appendChild(descriptionDiv);

    duration.innerText = subtask.duration;
    duration.classList.add("todo-item");
    subtaskLi.appendChild(duration);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>\n';
    editButton.classList.add("edit-btn", `standard-button`);
    // editButton.addEventListener("click", editTask);
    buttonsDiv.appendChild(editButton);

    const checkedButton = document.createElement("button");
    checkedButton.innerHTML = '<i class="fas fa-check"></i>';
    checkedButton.classList.add("check-btn", `standard-button`);
    // checkedButton.addEventListener("click", checkTask);
    buttonsDiv.appendChild(checkedButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-btn", `standard-button`);
    // deleteButton.addEventListener("click", deleteTaskFromDB);
    buttonsDiv.appendChild(deleteButton);

    subtaskLi.appendChild(buttonsDiv);
    toDoList.appendChild(subtaskLi);
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