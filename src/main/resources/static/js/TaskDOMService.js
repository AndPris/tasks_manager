export class TaskDOMService {
    calendar;

    constructor(calendar) {
        this.calendar = calendar;
    }

    displayTasks(tasks) {
        this.calendar.removeAllEvents();
        tasks.forEach((task) => {
            this.displayTask(task);
        });
    }

    displayTask(task) {
        const event = {
            id: task.id,
            title: task.description,
            start: new Date(task.finishDate),
            done: task.done,
            allDay: true,
            color: this.getTaskColor(task),
            classNames: this.getClassNames(task),
        };

        this.calendar.addEvent(event);
    }

    getTaskColor(task) {
        if(task.done)
            return 'gray';

        let color;
        switch (task.priority.name.toLowerCase()) {
            case 'high':
                color = 'red';
                break;
            case 'medium':
                color = 'blue'
                break;
            case 'low':
                color = 'green';
                break;
            default:
                color = 'yellow';
        }
        return color;
    }

    getClassNames(task) {
        if(task.done)
            return 'task-done';
        return '';
    }

    displayForm(dateStr) {

    }
}