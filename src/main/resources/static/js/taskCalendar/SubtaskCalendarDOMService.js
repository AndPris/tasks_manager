import {getColorByPriority, getDateWithShift} from "../utilFunctions.js";

export class SubtaskCalendarDOMService {
    displaySubtasks(subtasks, calendar) {
        subtasks.forEach((subtask) => {
            this.displaySubtask(subtask, calendar);
        });
    }

    displaySubtask(subtask, calendar) {
        const event = {
            id: subtask.id,
            isSubtask: true,
            title: "Subtask " + subtask.description,
            start: getDateWithShift(subtask.task.earliestPossibleStartTime, subtask.startTime),
            done: subtask.done,
            allDay: true,
            color: this.getSubtaskColor(subtask),
            classNames: this.getClassNames(subtask),
        };

        calendar.addEvent(event);
    }

    getSubtaskColor(subtask) {
        if(subtask.done)
            return 'gray';

        return getColorByPriority(subtask.task.priority);
    }

    getClassNames(subtask) {
        if(subtask.done)
            return 'task-done';
        return '';
    }
}