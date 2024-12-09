package sia.tasks_manager.algorithm.heuristic;

import sia.tasks_manager.data.Task;
import java.util.Map;

public interface TasksArrangementHeuristic {
    void arrangeTasks(Map<Task, Integer> tasksWithDuration);
}
