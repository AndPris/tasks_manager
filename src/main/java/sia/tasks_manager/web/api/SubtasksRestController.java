package sia.tasks_manager.web.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.web.dto.SubtaskDTO;
import sia.tasks_manager.repositories.SubtaskRepository;
import sia.tasks_manager.repositories.TaskRepository;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RepositoryRestController
public class SubtasksRestController {
    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;

    public SubtasksRestController(SubtaskRepository subtaskRepository, TaskRepository taskRepository) {
        this.subtaskRepository = subtaskRepository;
        this.taskRepository = taskRepository;
    }

    private SubtaskDTO convertToDTO(Subtask subtask) {
        List<SubtaskDTO.SimpleSubtaskDTO> previousSubtasks = subtask.getPreviousSubtasks()
                .stream()
                .map(previous -> new SubtaskDTO.SimpleSubtaskDTO(previous.getDescription()))
                .collect(Collectors.toList());

        return new SubtaskDTO(
                subtask.getId(),
                subtask.getDescription(),
                subtask.getDuration(),
                subtask.isDone(),
                previousSubtasks
        );
    }

    @GetMapping("/tasks/{taskId}/subtasks")
    public ResponseEntity<?> getAllSubtasksByTaskId(@PathVariable("taskId") Long taskId,
                                                    Pageable pageable, PagedResourcesAssembler<SubtaskDTO> pagedAssembler) {
        Page<Subtask> subtasksPage = subtaskRepository.findSubtasksByTaskId(taskId, pageable);
        Page<SubtaskDTO> dtoPage = subtasksPage.map(this::convertToDTO);
        PagedModel<EntityModel<SubtaskDTO>> subtasksToReturn = pagedAssembler.toModel(dtoPage);
        subtasksToReturn.add(linkTo(methodOn(SubtasksRestController.class).getAllSubtasksByTaskId(taskId, pageable, pagedAssembler)).withSelfRel());
        return ResponseEntity.ok(subtasksToReturn);
    }

    @PostMapping("/tasks/{taskId}/subtasks")
    public ResponseEntity<?> createSubtask(@PathVariable("taskId") Long taskId, @RequestBody Subtask subtask) {
        subtask.setTask(taskRepository.findById(taskId).get());
        EntityModel<Subtask> subtaskToReturn = EntityModel.of(subtaskRepository.save(subtask));
        return ResponseEntity.ok(subtaskToReturn);
    }
}
