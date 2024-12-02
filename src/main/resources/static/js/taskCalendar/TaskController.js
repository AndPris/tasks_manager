export class TaskController {
    currentDate;
    backendService;
    eventDOMService;
    formDOMService;
    popUpWindowDOMService;
    taskDOMService;
    calendar;

    constructor(backendService, eventDOMService, formDOMService,
                popUpWindowDOMService, taskDOMService) {
        this.currentDate = new Date();
        this.currentDate.setHours(0, 0, 0, 0);
        this.backendService = backendService;
        this.eventDOMService = eventDOMService;
        this.formDOMService = formDOMService;
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.taskDOMService = taskDOMService;
    }

    setCalendar(calendar) {
        this.calendar = calendar;
    }

    //GET
    async loadTasks() {
        let tasks = await this.backendService.loadTasks();
        this.calendar.removeAllEvents();
        this.taskDOMService.displayTasks(tasks, this.calendar);
    }



    //NON API
    handleDateClick(info) {
        this.popUpWindowDOMService.hidePopUpWindow();
        const infoDate = new Date(info.dateStr);
        if(infoDate < this.currentDate)
            return;

        this.formDOMService.setAllDay(info.allDay);
        this.formDOMService.displayFormOnPopUpWindow(info.dateStr);
        this.eventDOMService.hideEditButtons();
    }

    handleEventClick(info) {
        this.eventDOMService.displayEditButtonsOnPopUpWindow(info.event.title)
        this.eventDOMService.setInfo(info);
        this.formDOMService.hideForm();
    }

    async handleEventDrop(info) {
        const infoDate = new Date(info.event.startStr);
        if(infoDate < this.currentDate) {
            info.revert();
            return;
        }
        await this.backendService.patchTask(info.event.id, this.eventDOMService.getEventDataDuringDragNDrop(info));
    }
}