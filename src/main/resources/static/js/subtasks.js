import {updatePaginationButtons} from "backend_interaction.js";


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
    return [data._embedded ? data._embedded.subtasks : [], data.page];
}

export async function goForward() {
    pageNumber += 1;
    await loadSubtasks()
}

export async function goBackward() {
    pageNumber -= 1;
    await loadSubtasks()
}