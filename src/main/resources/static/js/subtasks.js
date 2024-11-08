import {
    getForm,
    getTaskDataForPatch,
    getTaskId,
    updatePaginationButtons
} from "backend_interaction.js";
import {clearChildren} from "dom_interaction.js"

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
const pageSize = 5;
let pageNumber = 0;
const baseURL = `/api/tasks/${taskId}/subtasks`;
const defaultNetworkErrorMessage = "Network response was not ok";
const toDoList = document.querySelector(".todo-list");



//POST
export async function addSubtaskToDB(event) {
    event.preventDefault();
    const form = getForm(event);

    const subtaskData = getSubtaskDataFromForm(form);
    console.log(subtaskData);
    try {
        await postSubtask(subtaskData);
        clearSubtasksForm(form);
        await loadSubtasks();
    } catch (err) {
        console.log(err);
    }
}

function getSubtaskDataFromForm(form) {
    return {
        description: form.description.value,
        duration: form.duration.value,
        done: false,
        previousSubtasks: Array.from(form["previous-subtasks"].selectedOptions).map(({ value }) => {return {id: value}})
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

function clearSubtasksForm(form) {
    form.description.value = ''
    form.duration.value = ''
}

//GET
export async function loadSubtasks(queryString) {
    queryString = queryString ? queryString : getDefaultQueryString();
    console.log(queryString);
    try {
        let [subtasks, pageInfo] = await getSubtasks(queryString);
        console.log(subtasks);
        displaySubtasks(subtasks);
        await populatePossiblePreviousSubtasks();
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
    clearChildren(".previous-subtasks-input");
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

    if(hasPreviousSubtasks(subtask))
        displayPreviousSubtasks(subtask, descriptionDiv);

    subtaskLi.appendChild(descriptionDiv);

    duration.innerText = subtask.duration;
    duration.classList.add("todo-item");
    subtaskLi.appendChild(duration);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>\n';
    editButton.classList.add("edit-btn", `standard-button`);
    editButton.addEventListener("click", editSubtask);
    buttonsDiv.appendChild(editButton);

    const checkedButton = document.createElement("button");
    checkedButton.innerHTML = '<i class="fas fa-check"></i>';
    checkedButton.classList.add("check-btn", `standard-button`);
    checkedButton.addEventListener("click", checkSubtask);
    buttonsDiv.appendChild(checkedButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-btn", `standard-button`);
    deleteButton.addEventListener("click", deleteSubtaskFromDB);
    buttonsDiv.appendChild(deleteButton);

    subtaskLi.appendChild(buttonsDiv);
    toDoList.appendChild(subtaskLi);
}

function hasPreviousSubtasks(subtask) {
    return subtask.previousSubtasks.length !== 0;
}

function displayPreviousSubtasks(subtask, destination) {
    const previousSubtasksDiv = document.createElement("div");
    previousSubtasksDiv.classList.add("previous-subtasks");

    let content = "Previous subtasks: ";
    subtask.previousSubtasks.sort((a, b) => {return a.id - b.id}).forEach((previousSubtask) => content += previousSubtask.description + ", ");
    content = content.substring(0, content.length-2);
    previousSubtasksDiv.textContent = content;

    destination.appendChild(previousSubtasksDiv);
}

async function populatePossiblePreviousSubtasks() {
    const possiblePreviousSubtasks = document.getElementById("previous-subtasks");
    const subtasks = await getAllSubtasks();
    console.log("All subtasks:")
    console.log(subtasks)
    subtasks.forEach((subtask) => {possiblePreviousSubtasks.appendChild(getPreviousSubtaskOption(subtask))});
}

async function getAllSubtasks() {
    const [subtasks, pageInfo] = await getSubtasks('?all=true');
    return subtasks;
}

function getPreviousSubtaskOption(subtask) {
    const option = document.createElement("option");
    option.value = subtask.id;
    option.textContent = subtask.description;
    return option;
}

//PATCH
async function checkSubtask() {
    try {
        await patchSubtask(getTaskId(this), getTaskDataForPatch(this));
        await loadSubtasks();
    } catch (err) {
        console.log(err);
    }
}

async function patchSubtask(subtaskId, data) {
    console.log(data);
    let response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(data),
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}



//DELETE
async function deleteSubtaskFromDB() {
    try {
        await deleteSubtask(getTaskId(this));
        await loadSubtasks();
    } catch (err) {
        console.log(err);
    }
}

async function deleteSubtask(subtaskId) {
    let response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}



//PUT
async function editSubtask() {
    await showEditSubtaskMenu(this.closest("li"));
}

async function showEditSubtaskMenu(subtaskLiItem) {
    const subtaskId = subtaskLiItem.getAttribute("id");
    const subtask = await fetchSubtask(subtaskId);

    const form = document.getElementById("form");
    form.setAttribute("subtask-id", subtaskId);

    const descriptionField = document.getElementById('description');
    descriptionField.value = subtask.description;
    descriptionField.placeholder = "Edit the subtask.";

    document.getElementById('duration').value = subtask.duration;
    document.querySelector('.todo-btn').textContent = "Edit Subtask!";

    const selectElement = document.getElementById("previous-subtasks");
    const valuesToSelect = subtask.previousSubtasks.map((subtask) => Number(subtask.id));
    await removeImpossiblePreviousSubtasksOptions(selectElement, subtaskId);
    for (let option of selectElement.options) {
        if (valuesToSelect.includes(Number(option.value))) {
            option.selected = true;
        }
    }

    form.method = "put";

    document
        .getElementById("form")
        .removeEventListener("submit", addSubtaskToDB);

    document
        .getElementById("form")
        .addEventListener("submit", editSubtaskInDB);

    clearChildren('.todo-list');
}

async function fetchSubtask(subtaskId) {
    const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);

    return await response.json();
}

async function removeImpossiblePreviousSubtasksOptions(selectElement, subtaskId) {
    removeOptionByValue(selectElement, subtaskId);
    await removeCircularOptions(selectElement, subtaskId);
}

function removeOptionByValue(selectElement, valueToRemove) {
    for (let i = 0; i < selectElement.options.length; i++) {
        if (Number(selectElement.options[i].value) === Number(valueToRemove)) {
            selectElement.remove(i);
            break;
        }
    }
}

async function removeCircularOptions(selectElement, subtaskId) {
    const allSubtasks = await getAllSubtasks();
    for(let subtask of allSubtasks) {
        for(let previousSubtask of subtask.previousSubtasks) {
            if(previousSubtask.id.toString() === subtaskId)
                removeOptionByValue(selectElement, subtask.id.toString());
        }
    }
}


async function editSubtaskInDB(event) {
    event.preventDefault();

    try {
        await putSubtask(this.getAttribute("subtask-id"), getSubtaskDataFromForm(getForm(event)));
        window.location.reload();
    } catch (err) {
        console.log(err);
    }

}

async function putSubtask(subtaskId, data) {
    let response = await fetch(`${baseURL}/${subtaskId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(data),
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);
}


//PLAN
export async function plan() {
    const response = await fetch(`/api/tasks/plan/${taskId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);

    const data = await response.json();
    console.log(data);
}