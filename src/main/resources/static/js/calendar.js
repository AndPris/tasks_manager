import {BackendService} from "BackendService.js"
import {TaskDOMService} from "TaskDOMService.js"
import {FormDOMService} from "FormDOMService.js"

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

document.addEventListener('DOMContentLoaded', async function() {
    const backendService = new BackendService(csrfHeader, csrfToken);
    const formDOMService = new FormDOMService(backendService);

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
            formDOMService.displayFormWindow(info.dateStr);
        }
    });
    calendar.render();

    const taskDOMService = new TaskDOMService(calendar);
    formDOMService.setTaskDOMService(taskDOMService);
    taskDOMService.displayTasks(await backendService.loadTasks());
});