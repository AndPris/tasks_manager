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
    const eventDOMService = new EventDOMService(popUpWindowDOMService, backendService, formDOMService);

    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        firstDay: 1,
        selectable: true,
        editable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: [],
        eventOrder: "done,title",
        eventClick: function(info) {
            eventDOMService.displayEditButtonsOnPopUpWindow(info.event.title)
            eventDOMService.setInfo(info);
            formDOMService.hideForm();
        },
        dateClick: function(info) {
            formDOMService.displayFormOnPopUpWindow(info.dateStr);
            eventDOMService.hideEditButtons();
        },
        eventMouseEnter: function(info) {
            info.el.style.cursor = "pointer";
        },
        eventDrop: function(info) {
            backendService.patchTask(info.event.id, eventDOMService.getEventDataDuringDragNDrop(info));
        }
    });
    calendar.render();

    const taskDOMService = new TaskDOMService(calendar);

    formDOMService.setTaskDOMService(taskDOMService);
    eventDOMService.setTaskDOMService(taskDOMService);
    taskDOMService.displayTasks(await backendService.loadTasks());
});