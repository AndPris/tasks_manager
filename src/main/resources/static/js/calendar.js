import {addTaskToDB, loadTasks, goForward, goBackward, sortTasksByFinishDate, sortTasksByPriority, findTask} from 'backend_interaction.js';

document.addEventListener('DOMContentLoaded', async function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        events: [],
        eventClick: function(info) {
            console.log(info.event);
        }
    });
    calendar.render();

    window.calendarInstance = calendar;

    await loadTasks();
});