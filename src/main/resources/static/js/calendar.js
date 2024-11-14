import {BackendService} from "BackendService.js"
import {TaskDOMService} from "TaskDOMService.js"
import {FormDOMService} from "FormDOMService.js"

document.addEventListener('DOMContentLoaded', async function() {
    const formDOMService = new FormDOMService;

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        events: [],
        eventOrder: "done,title",
        eventClick: function(info) {
            console.log(info.event);
        },
        dateClick: function(info) {
            console.log(info);
            formDOMService.displayFormWindow(info);
        }
    });
    calendar.render();

    const backendService = new BackendService;
    const taskDOMService = new TaskDOMService(calendar);
    taskDOMService.displayTasks(await backendService.loadTasks());
});