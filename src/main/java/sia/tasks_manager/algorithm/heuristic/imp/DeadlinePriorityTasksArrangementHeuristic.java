package sia.tasks_manager.algorithm.heuristic.imp;

import org.springframework.stereotype.Component;
import sia.tasks_manager.algorithm.heuristic.TasksArrangementHeuristic;
import sia.tasks_manager.data.Task;
import static sia.tasks_manager.utils.DateUtils.getDateWithShift;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class DeadlinePriorityTasksArrangementHeuristic implements TasksArrangementHeuristic {
    private static final int TASKS_GAP = 1;

    @Override
    public void arrangeTasks(Map<Task, Integer> tasksWithDuration) {
        if(tasksWithDuration.isEmpty())
            return;

        List<Task> tasks = sortTasksByFinishDateAndPriority(tasksWithDuration);

        Date previousTaskEarliestStartTime = tasks.get(0).getCreationTime();
        int previousTaskDuration = 0;
        for (Task task : tasks) {
            Date earliestPossibleStartTime = getEarliestPossibleStartTime(task, tasksWithDuration.get(task),
                    previousTaskEarliestStartTime, previousTaskDuration);
            previousTaskEarliestStartTime = earliestPossibleStartTime;
            previousTaskDuration = tasksWithDuration.get(task) + TASKS_GAP;
            task.setEarliestPossibleStartTime(earliestPossibleStartTime);
        }
    }

    private List<Task> sortTasksByFinishDateAndPriority(Map<Task, Integer> tasksWithDuration) {
        List<Task> tasks = new ArrayList<>(tasksWithDuration.keySet());
        tasks.sort((a, b) -> {
            if(a.getFinishDate().compareTo(b.getFinishDate()) < 0)
                return -1;
            if(a.getFinishDate().compareTo(b.getFinishDate()) > 0)
                return 1;

            if(a.getPriority().getId() < b.getPriority().getId())
                return -1;
            if(a.getPriority().getId() > b.getPriority().getId())
                return 1;

            return 0;
        });
        return tasks;
    }

    private Date getEarliestPossibleStartTime(Task task, int taskDuration,
                                              Date previousTaskEarliestStartTime, int previousTaskDuration) {
        if(getDateWithShift(previousTaskEarliestStartTime, previousTaskDuration + taskDuration).compareTo(task.getFinishDate()) > 0) {
            if(getDateWithShift(task.getFinishDate(), -taskDuration).compareTo(task.getCreationTime()) < 0)
                return task.getCreationTime();

            return getDateWithShift(task.getFinishDate(), -taskDuration);
        }

        return getDateWithShift(previousTaskEarliestStartTime, previousTaskDuration);
    }
}
