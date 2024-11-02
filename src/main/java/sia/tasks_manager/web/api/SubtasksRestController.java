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
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.repositories.SubtaskRepository;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RepositoryRestController
public class SubtasksRestController {
    private final SubtaskRepository subtaskRepository;

    public SubtasksRestController(SubtaskRepository subtaskRepository) {
        this.subtaskRepository = subtaskRepository;
    }

    @GetMapping("/tasks/{taskId}/subtasks")
    public ResponseEntity<?> getAllSubtasksByTaskId(@PathVariable("taskId") Long taskId,
                                                    Pageable pageable, PagedResourcesAssembler<Subtask> pagedAssembler) {
        Page<Subtask> subtasksPage = subtaskRepository.findSubtasksByTaskId(taskId, pageable);
        PagedModel<EntityModel<Subtask>> subtasksToReturn = pagedAssembler.toModel(subtasksPage);
        subtasksToReturn.add(linkTo(methodOn(SubtasksRestController.class).getAllSubtasksByTaskId(taskId, pageable, pagedAssembler)).withSelfRel());
        return ResponseEntity.ok(subtasksToReturn);
    }
}
