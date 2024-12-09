import {getColorByPriority, getDateWithShift} from "../utilFunctions.js";

export class SubtaskCalendarDOMService {
    displaySubtasks(subtasks, calendar) {
        subtasks.forEach((subtask) => {
            this.displaySubtask(subtask, calendar);
        });
    }

    displaySubtask(subtask, calendar) {
        if(subtask.finishTime === 0)
            return;

        this.displayEarliestPossibleStartEvent(subtask, calendar);
        this.displayStartWithoutShiftsEvent(subtask, calendar);
        this.displayMustStartEvent(subtask, calendar);
        this.displayDeadlineEvent(subtask, calendar);
    }

    displayEarliestPossibleStartEvent(subtask, calendar) {
        if(subtask.critical)
            return;

        const earliestPossibleStartEvent = this.getSubtaskEvent(subtask,
            `Earliest start for subtask ${subtask.description}`,
            subtask.startTime,
            "green");
        calendar.addEvent(earliestPossibleStartEvent);
    }

    displayStartWithoutShiftsEvent(subtask, calendar) {
        if(subtask.freeTimeStock >= subtask.totalTimeStock)
            return;

        const startWithoutShiftsEvent = this.getSubtaskEvent(subtask,
            `Start without shifts for subtask ${subtask.description}`,
            subtask.startTime + subtask.freeTimeStock,
            "rgb(166, 209, 67)");
        calendar.addEvent(startWithoutShiftsEvent);
    }

    displayMustStartEvent(subtask, calendar) {
        const mustHaveStartEvent = this.getSubtaskEvent(subtask,
            `Must start subtask ${subtask.description}`,
            subtask.startTime + subtask.totalTimeStock,
            "orange");
        calendar.addEvent(mustHaveStartEvent);
    }

    displayDeadlineEvent(subtask, calendar) {
        const deadlineEvent = this.getSubtaskEvent(subtask,
            `Deadline of subtask ${subtask.description}`,
            subtask.finishTime,
            "red");
        calendar.addEvent(deadlineEvent);
    }

    getSubtaskEvent(subtask, title, startShift, color) {
        return {
            id: subtask.id,
            taskId: subtask.task.id,
            isSubtask: true,
            title: title,
            start: getDateWithShift(subtask.task.earliestPossibleStartTime, startShift),
            done: subtask.done,
            allDay: true,
            color: subtask.done ? "grey" : color,
            classNames: this.getClassNames(subtask),
        };
    }

    getClassNames(subtask) {
        if(subtask.done)
            return 'task-done shift-right';
        return 'shift-right';
    }
}