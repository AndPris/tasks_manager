package sia.tasks_manager.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class SubtaskDTO {
    private Long id;
    private String description;
    private int duration;
    private boolean done;
    private List<PreviousSubtaskDTO> previousSubtasks;

    @Data
    public static class PreviousSubtaskDTO {
        private Long id;
        private String description;

        public PreviousSubtaskDTO(Long id, String description) {
            this.id = id;
            this.description = description;
        }
    }

    public SubtaskDTO(Long id, String description, int duration, boolean done, List<PreviousSubtaskDTO> previousSubtasks) {
        this.id = id;
        this.description = description;
        this.duration = duration;
        this.done = done;
        this.previousSubtasks = previousSubtasks;
    }
}