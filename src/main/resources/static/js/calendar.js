import {addTaskToDB, loadTasks, goForward, goBackward, sortTasksByFinishDate, sortTasksByPriority, findTask} from 'backend_interaction.js';
import {displayTasks} from "dom_interaction.js";
import {BackendService} from "BackendService.js"

document.addEventListener('DOMContentLoaded', async function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        events: [],
        eventOrder: "done,title",
        eventClick: function(info) {
            console.log(info.event);
        }
    });
    calendar.render();

    window.calendarInstance = calendar;

    const backendService = new BackendService;
    displayTasks(await backendService.loadTasks());
});