import {validateForm} from "data_validation.js";
import {clearForm, displayTasks} from "dom_interaction.js";

const baseURL = "/api/tasks";
const defaultNetworkErrorMessage = "Network response was not ok";
const pageSize = 5;
let pageNumber = 0;
let sortOrders= [];
let descriptionToFind = '';
let prioritySortOrder = 0;
let finishDateSortOrder = 0;


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
        clearForm(form);
        await loadTasks();
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
        await loadTasks();
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
        await loadTasks();
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


//GET
export async function loadTasks(queryString) {
    queryString = queryString ? queryString : getDefaultQueryString();

    try {
        let [tasks, pageInfo] = await getTasks(queryString);
        displayTasks(tasks);
        updatePaginationButtons(pageInfo);
    } catch (err) {
        console.log(err);
    }
}

function getDefaultQueryString() {
    let queryString = `?page=${pageNumber}&size=${pageSize}&sort=done,asc`;

    for(let sortOrder of sortOrders) {
        if(sortOrder[1] === 0)
            continue;

        queryString += `&sort=${sortOrder[0]},${getSortingOrderByCode(sortOrder[1])}`;
    }

    return queryString;
}

function getSortingOrderByCode(code) {
    if (code === 1)
        return "asc";
    if (code === 2)
        return "desc";
}

async function getTasks(queryString) {
    const response = await fetch(`${baseURL}${queryString}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok)
        throw new Error(defaultNetworkErrorMessage);

    const data = await response.json();
    return [data._embedded.tasks, data.page];
}

function updatePaginationButtons(pageInfo) {
    const backwardButton = document.getElementById("backward-button");
    const forwardButton = document.getElementById("forward-button");

    let [currentPage, totalPages] = parsePageInfo(pageInfo);

    if(currentPage === 0)
        backwardButton.style.display = 'none';
    else
        backwardButton.style.display = '';

    if(currentPage+1 >= totalPages)
        forwardButton.style.display = 'none';
    else
        forwardButton.style.display = '';
}

function parsePageInfo(pageInfo) {
    if(pageInfo)
        return [pageInfo.number, pageInfo.totalPages];
    else
        return [0, 1];
}


export async function goForward() {
    pageNumber += 1;
    await loadTasks()
}

export async function goBackward() {
    pageNumber -= 1;
     await loadTasks()
}

export async function sortTasksByPriority() {
    prioritySortOrder = (prioritySortOrder+1) % 3;
    sortOrders = [["priority", prioritySortOrder], ["finishDate", finishDateSortOrder]];
    await loadTasks();

    const button = document.getElementById("priority-sort-button");
    let buttonText = "By priority";

    if(prioritySortOrder === 1)
        buttonText += " ↓";
    else if(prioritySortOrder === 2)
        buttonText += " ↑";

    button.textContent = buttonText;
}

export async function sortTasksByFinishDate() {
    finishDateSortOrder = (finishDateSortOrder+1) % 3;
    sortOrders = [["finishDate", finishDateSortOrder], ["priority", prioritySortOrder]];
    await loadTasks();

    const button = document.getElementById("finish-date-sort-button");
    let buttonText = "By finish date";

    if(finishDateSortOrder === 1)
        buttonText += " ↓";
    else if(finishDateSortOrder === 2)
        buttonText += " ↑";

    button.textContent = buttonText;
}

export async function findTask() {
    pageNumber = 0;
    const descriptionField = document.getElementById("descriptionToFind");
    descriptionToFind = descriptionField.value;

    if(descriptionToFind) {
        let queryString = `/search/findByDescription?description=${descriptionToFind}`;
        await loadTasks(queryString);
        descriptionField.value = '';
    } else {
        await loadTasks();
    }
}