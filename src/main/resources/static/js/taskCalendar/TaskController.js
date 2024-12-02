export class TaskController {
    backendService;
    eventDOMService;
    formDOMService;
    popUpWindowDOMService;
    taskDOMService;
    calendar;

    constructor(backendService, eventDOMService, formDOMService,
                popUpWindowDOMService, taskDOMService, calendar) {
        this.backendService = backendService;
        this.eventDOMService = eventDOMService;
        this.formDOMService = formDOMService;
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.taskDOMService = taskDOMService;
        this.calendar = calendar;
    }


    //GET
    async loadTasks() {
        let tasks = await this.backendService.loadTasks();
        this.calendar.removeAllEvents();
        this.taskDOMService.displayTasks(tasks);
    }
}