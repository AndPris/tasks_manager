package sia.tasks_manager.web.api;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.*;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.TaskRepository;

@RestController
@RequestMapping(path = "/api/tasks",
        produces = "application/json")
public class TasksRestController {
    private final TaskRepository taskRepository;

    public TasksRestController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public Iterable<Task> allTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable("taskId") Long taskId) {
        try {
            taskRepository.deleteById(taskId);
        } catch (EmptyResultDataAccessException e) {}
    }
}
