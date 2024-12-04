import {getColorByPriority} from "../utilFunctions.js";

export class TaskDOMService {
    displayTasks(tasks, calendar) {
        tasks.forEach((task) => {
            this.displayTask(task, calendar);
        });
    }

    displayTask(task, calendar) {
        const event = {
            id: task.id,
            isSubtask: false,
            title: task.description,
            priority: task.priority.name,
            priorityId: task.priority.id,
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

        return getColorByPriority(task.priority);
    }

    getClassNames(task) {
        if(task.done)
            return 'task-done';
        return '';
    }
}