import {BackendService} from "BackendService.js"
import {TaskDOMService} from "TaskDOMService.js"
import {FormDOMService} from "FormDOMService.js"
import {EventDOMService} from "EventDOMService.js";
import {PopUpWindowDOMService} from "PopUpWindowDOMService.js";
import {TaskController} from "TaskController.js";

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

document.addEventListener('DOMContentLoaded', async function() {
    const popUpWindowDOMService = new PopUpWindowDOMService();
    const backendService = new BackendService(csrfHeader, csrfToken);
    const formDOMService = new FormDOMService();
    const eventDOMService = new EventDOMService();
    const taskDOMService = new TaskDOMService();

    const taskController = new TaskController(backendService, eventDOMService, formDOMService,
        popUpWindowDOMService, taskDOMService);

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
        eventOrder: "done,allDay,priorityId,title",
        views : {
            timeGridWeek: {
                dayHeaderFormat: { weekday: 'short', month: '2-digit', day: '2-digit', omitCommas: true,  },
                slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                allDaySlot: true,
                slotDuration: '00:30:00',
            }
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        locale: 'en-GB',
        eventClick: function(info) {
            taskController.handleEventClick(info);
        },
        dateClick: function(info) {
            taskController.handleDateClick(info);
        },
        eventMouseEnter: function(info) {
            info.el.style.cursor = "pointer";
        },
        eventDrop: async function(info) {
            await taskController.handleEventDrop(info);
        }
    });
    calendar.render();

    taskController.setCalendar(calendar);
    await taskController.loadTasks();
});