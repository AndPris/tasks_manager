export class TaskDOMService {
    displayTasks(tasks, calendar) {
        tasks.forEach((task) => {
            this.displayTask(task, calendar);
        });
    }

    displayTask(task, calendar) {
        const event = {
            id: task.id,
            title: task.description,
            priority: task.priority.name,
            start: new Date(task.finishDate),
            done: task.done,
            allDay: task.allDay,
            color: this.getTaskColor(task),
            classNames: this.getClassNames(task),
        };

        calendar.addEvent(event);
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

    removeEvent(event) {
        this.calendar.getEventById(event.id).remove();
    }
}