package sia.tasks_manager.web.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.TaskRepository;
import sia.tasks_manager.repositories.UserRepository;

import java.security.Principal;
import java.util.Date;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RepositoryRestController
public class TasksRestController {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TasksRestController(TaskRepository taskRepository, UserRepository userRepository) {
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
        EntityModel<Task> taskToReturn = EntityModel.of(taskRepository.save(task));
        return ResponseEntity.ok(taskToReturn);
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasksByCurrentUser(Principal user,
                                                      Pageable pageable, PagedResourcesAssembler<Task> pagedAssembler) {
        System.out.println(pageable);
        System.out.println(pageable.getSort());
        Page<Task> tasksPage = taskRepository.findTasksByUserUsername(user.getName(), pageable);
        PagedModel<EntityModel<Task>> tasksToReturn = pagedAssembler.toModel(tasksPage);
        System.out.println(tasksToReturn);
        tasksToReturn.add(linkTo(methodOn(TasksRestController.class).getAllTasksByCurrentUser(user, pageable, pagedAssembler)).withSelfRel());
        return ResponseEntity.ok(tasksToReturn);
    }
}
