package sia.tasks_manager.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class SubtaskDTO {
    private Long id;
    private String description;
    private int duration;
    private boolean done;
    private List<SimpleSubtaskDTO> previousSubtasks;

    @Data
    public static class SimpleSubtaskDTO {
        private Long id;

        public SimpleSubtaskDTO(Long id) {
            this.id = id;
        }
    }

    public SubtaskDTO(Long id, String description, int duration, boolean done, List<SimpleSubtaskDTO> previousSubtasks) {
        this.id = id;
        this.description = description;
        this.duration = duration;
        this.done = done;
        this.previousSubtasks = previousSubtasks;
    }
}