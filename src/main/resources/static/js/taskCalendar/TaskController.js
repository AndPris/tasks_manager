export class TaskController {
    currentDate;
    backendService;
    eventDOMService;
    formDOMService;
    popUpWindowDOMService;
    taskDOMService;
    calendar;
    postHandler;
    putHandler;
    checkHandler;
    deleteHandler;
    subtasksPageHandler;
    info;
    isEventDone;

    constructor(backendService, eventDOMService, formDOMService,
                popUpWindowDOMService, taskDOMService) {
        this.currentDate = new Date();
        this.currentDate.setHours(0, 0, 0, 0);

        this.backendService = backendService;
        this.eventDOMService = eventDOMService;
        this.formDOMService = formDOMService;
        this.popUpWindowDOMService = popUpWindowDOMService;
        this.taskDOMService = taskDOMService;

        this.postHandler = this.createTask.bind(this);
        this.formDOMService.setPostHandler(this.postHandler);
        this.formDOMService.createForm(this.popUpWindowDOMService.getPopUpWindow());

        this.deleteHandler = this.deleteTask.bind(this);

        this.eventDOMService.setDeleteHandler(this.deleteHandler);
        this.eventDOMService.createEditButtons(this.popUpWindowDOMService.getPopUpWindow());

    }

    setCalendar(calendar) {
        this.calendar = calendar;
    }

    setInfo(info) {
        this.info = info;
        this.isEventDone = this.info.event.extendedProps.done;
    }

    //GET
    async loadTasks() {
        let tasks = await this.backendService.loadTasks();
        this.calendar.removeAllEvents();
        this.taskDOMService.displayTasks(tasks, this.calendar);
    }


    //POST
    async createTask(event) {
        event.preventDefault();
        const task = await this.backendService.postTask(this.formDOMService.getFormData());
        this.taskDOMService.displayTask(task, this.calendar);
        this.formDOMService.clearForm();
    }


    //DELETE
    async deleteTask() {
        this.removeEvent(this.info.event);
        await this.backendService.deleteTask(this.getEventId());
        this.eventDOMService.hideEditButtons();
        this.popUpWindowDOMService.hidePopUpWindow();
    }

    removeEvent(event) {
        this.calendar.getEventById(event.id).remove();
    }

    getEventId() {
        return this.info.event.id;
    }

    //NON API
    handleDateClick(info) {
        const date = info.dateStr;
        this.popUpWindowDOMService.hidePopUpWindow();
        const infoDate = new Date(date);
        if(infoDate < this.currentDate)
            return;

        this.formDOMService.setAllDay(info.allDay);
        this.formDOMService.setDate(date);
        this.popUpWindowDOMService.displayPopUpWindow(`Selected Date: ${this.getClearDateString(date)}`);
        this.formDOMService.displayForm();
        this.eventDOMService.hideEditButtons();
    }

    getClearDateString(date) {
        date = date.replace('T', ' ');

        const indexOfDelim = date.indexOf('+');
        if(indexOfDelim !== -1)
            date = date.slice(0, indexOfDelim);

        return date;
    }

    handleEventClick(info) {
        this.popUpWindowDOMService.displayPopUpWindow(info.event.title);
        this.eventDOMService.displayEditButtons();
        this.setInfo(info);
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