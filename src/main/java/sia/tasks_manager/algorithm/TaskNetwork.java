package sia.tasks_manager.algorithm;

import lombok.Data;
import sia.tasks_manager.data.Task;

@Data
public class TaskNetwork {
    private final Task task;
    private Event start;
    private Event finish;

    public TaskNetwork(Task task) {
        this.task = task;
    }
}
