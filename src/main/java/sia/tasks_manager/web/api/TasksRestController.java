package sia.tasks_manager.web.api;

import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.*;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.TaskRepository;

import java.util.Date;

@RepositoryRestController
@RestController
public class TasksRestController {
    private final TaskRepository taskRepository;

    public TasksRestController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @PutMapping("/tasks/{taskId}")
    public Task updateTask(@PathVariable("taskId") Long taskId, @RequestBody Task task) {
        task.setId(taskId);
        task.setCreationTime(new Date());
        return taskRepository.save(task);
    }
}
