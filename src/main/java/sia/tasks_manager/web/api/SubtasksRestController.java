package sia.tasks_manager.web.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.services.SubtasksService;
import sia.tasks_manager.web.dto.SubtaskDTO;
import sia.tasks_manager.repositories.SubtaskRepository;
import sia.tasks_manager.repositories.TaskRepository;

import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RepositoryRestController
public class SubtasksRestController {
    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;
    private final SubtasksService subtasksService;

    public SubtasksRestController(SubtaskRepository subtaskRepository, TaskRepository taskRepository,
                                  SubtasksService subtasksService) {
        this.subtaskRepository = subtaskRepository;
        this.taskRepository = taskRepository;
        this.subtasksService = subtasksService;
    }

    @GetMapping("/tasks/{taskId}/subtasks")
    public ResponseEntity<?> getPageOfSubtasksByTaskId(@PathVariable("taskId") Long taskId,
                                                    @RequestParam(required = false) boolean all,
                                                    Pageable pageable, PagedResourcesAssembler<SubtaskDTO> pagedAssembler) {
        if(all)
            pageable = Pageable.unpaged();

        Page<Subtask> subtasksPage = subtaskRepository.findSubtasksByTaskId(taskId, pageable);
        Page<SubtaskDTO> dtoPage = subtasksPage.map(subtasksService::convertToDTO);
        PagedModel<EntityModel<SubtaskDTO>> subtasksToReturn = pagedAssembler.toModel(dtoPage);
        subtasksToReturn.add(linkTo(methodOn(SubtasksRestController.class).getPageOfSubtasksByTaskId(taskId, all, pageable, pagedAssembler)).withSelfRel());
        return ResponseEntity.ok(subtasksToReturn);
    }

    @GetMapping("/subtasks/{subtaskId}")
    public ResponseEntity<?> getSubtaskById(@PathVariable("subtaskId") Long subtaskId) {
        Optional<Subtask> subtask = subtaskRepository.findById(subtaskId);
        if(subtask.isEmpty())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(subtasksService.convertToDTO(subtask.get()));
    }

    @PostMapping("/tasks/{taskId}/subtasks")
    public ResponseEntity<?> createSubtask(@PathVariable("taskId") Long taskId, @RequestBody Subtask subtask) {
        Optional<Task> task = taskRepository.findById(taskId);
        if(task.isEmpty())
            return ResponseEntity.notFound().build();

        subtask.setTask(task.get());
        EntityModel<Subtask> subtaskToReturn = EntityModel.of(subtaskRepository.save(subtask));
        return ResponseEntity.ok(subtaskToReturn);
    }

    @PatchMapping(value = "/subtasks/{subtaskId}", consumes = {"application/json"})
    public ResponseEntity<?> toggleDoneSubtask(@PathVariable("subtaskId") Long subtaskId, @RequestBody SubtaskDTO newSubtaskData) {
        Optional<Subtask> optionalSubtask = subtaskRepository.findById(subtaskId);

        if(optionalSubtask.isEmpty())
            return ResponseEntity.notFound().build();

        Subtask subtaskToUpdate = optionalSubtask.get();
        subtasksService.updateSubtask(subtaskToUpdate, newSubtaskData);
        return ResponseEntity.ok(subtaskRepository.save(subtaskToUpdate));
    }

    @DeleteMapping("/subtasks/{subtaskId}")
    public ResponseEntity<?> cascadeDeleteSubtasks(@PathVariable("subtaskId") Long subtaskId) {
        subtasksService.deleteSubtaskWithDependencies(subtaskId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/tasks/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<?> updateSubtask(@PathVariable("taskId") Long taskId, @PathVariable("subtaskId") Long subtaskId, @RequestBody Subtask subtask) {
        if(taskRepository.findById(taskId).isEmpty())
            return ResponseEntity.notFound().build();

        subtask.setId(subtaskId);
        subtask.setTask(taskRepository.findById(taskId).get());
        EntityModel<Subtask> subtaskToReturn = EntityModel.of(subtaskRepository.save(subtask));
        return ResponseEntity.ok(subtaskToReturn);
    }
}
