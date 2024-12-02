package sia.tasks_manager.web.api;

import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.PriorityRepository;
import sia.tasks_manager.repositories.TaskRepository;
import sia.tasks_manager.repositories.UserRepository;

import java.security.Principal;
import java.util.Date;

@RepositoryRestController
public class TasksRestController {
    private final PriorityRepository priorityRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TasksRestController(PriorityRepository priorityRepository, TaskRepository taskRepository, UserRepository userRepository) {
        this.priorityRepository = priorityRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable("taskId") Long taskId, @RequestBody Task task, Principal user) {
        task.setId(taskId);
        task.setCreationTime(new Date());
        task.setUser(userRepository.findByUsername(user.getName()));
        EntityModel<Task> taskToReturn = EntityModel.of(taskRepository.save(task));
        return ResponseEntity.ok(taskToReturn);
    }

    @PostMapping("/tasks")
    public ResponseEntity<?> createTask(@RequestBody Task task, Principal user) {
        task.setUser(userRepository.findByUsername(user.getName()));
        task.getPriority().setName(priorityRepository.findNameById(task.getPriority().getId()));
        EntityModel<Task> taskToReturn = EntityModel.of(taskRepository.save(task));
        return ResponseEntity.ok(taskToReturn);
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasksByCurrentUser(Principal user) {
        Iterable<Task> tasks = taskRepository.findTasksByUserUsername(user.getName());
        return ResponseEntity.ok(tasks);
    }
}
