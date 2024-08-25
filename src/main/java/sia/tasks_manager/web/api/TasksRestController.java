package sia.tasks_manager.web.api;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.TaskRepository;

import java.util.Date;

@RestController
@RequestMapping(path = "/api/tasks",
        produces = "application/json")
@ConfigurationProperties(prefix = "task-manager.tasks")
public class TasksRestController {
    private final TaskRepository taskRepository;
    private int pageSize;

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public TasksRestController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/{pageNumber}")
    public Iterable<Task> allTasks(@PathVariable("pageNumber") int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return taskRepository.findAllByOrderByDoneAscPriorityAsc(pageable);
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

    @PatchMapping("/{taskId}")
    public Task toggleTaskIsDone(@PathVariable("taskId") Long taskId) {
        Task taskToUpdate = taskRepository.findById(taskId).get();
        taskToUpdate.setDone(!taskToUpdate.isDone());
        return taskRepository.save(taskToUpdate);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable("taskId") Long taskId, @RequestBody Task task) {
        task.setId(taskId);
        task.setCreationTime(new Date());
        return taskRepository.save(task);
    }
}
