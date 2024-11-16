import {BackendService} from "BackendService.js"
import {TaskDOMService} from "TaskDOMService.js"
import {FormDOMService} from "FormDOMService.js"
import {EventDOMService} from "EventDOMService.js";
import {PopUpWindowDOMService} from "PopUpWindowDOMService.js";

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

document.addEventListener('DOMContentLoaded', async function() {
    const popUpWindowDOMService = new PopUpWindowDOMService;
    const backendService = new BackendService(csrfHeader, csrfToken);
    const formDOMService = new FormDOMService(popUpWindowDOMService, backendService);
    const eventDOMService = new EventDOMService;

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        editable: true,
        events: [],
        eventOrder: "done,title",
        eventClick: function(info) {
            console.log("Event Click");
            console.log(info.event);
        },
        dateClick: function(info) {
            console.log("Date Click");
            console.log(info);
            formDOMService.displayFormOnPopUpWindow(info.dateStr);
        },
        eventMouseEnter: function(info) {
            info.el.style.cursor = "pointer";
        },
        eventDrop: function(info) {
            console.log("Drop");
            console.log(info);
            backendService.patchTask(info.event.id, eventDOMService.getEventDataDuringDragNDrop(info));
        }
    });
    calendar.render();

    const taskDOMService = new TaskDOMService(calendar);
    formDOMService.setTaskDOMService(taskDOMService);
    taskDOMService.displayTasks(await backendService.loadTasks());
});