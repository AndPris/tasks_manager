import {BackendService} from "BackendService.js"
import {DOMService} from "DOMService.js"

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

    // window.calendarInstance = calendar;

    const backendService = new BackendService;
    const domService = new DOMService(calendar);
    domService.displayTasks(await backendService.loadTasks());
});