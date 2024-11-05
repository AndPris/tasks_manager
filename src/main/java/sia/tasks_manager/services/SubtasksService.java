package sia.tasks_manager.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.repositories.SubtaskRepository;
import sia.tasks_manager.web.dto.SubtaskDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubtasksService {
    private final SubtaskRepository subtaskRepository;

    public SubtasksService(SubtaskRepository subtaskRepository) {
        this.subtaskRepository = subtaskRepository;
    }

    @Transactional
    public void deleteSubtaskWithDependencies(Long subtaskId) {
        subtaskRepository.removeDependencies(subtaskId);
        subtaskRepository.deleteById(subtaskId);
    }

    public SubtaskDTO convertToDTO(Subtask subtask) {
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
}
