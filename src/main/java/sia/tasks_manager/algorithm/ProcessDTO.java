package sia.tasks_manager.algorithm;

import lombok.Data;

@Data
public class ProcessDTO {
    private Long id;
    private String description;
    private int duration;
    private int startTime;
    private int finishTime;
    private boolean isCritical;
    private int totalTimeStock;
    private int freeTimeStock;

    public ProcessDTO(Long id, String description, int duration, int startTime, int finishTime, boolean isCritical,
                      int totalTimeStock, int freeTimeStock) {
        this.id = id;
        this.description = description;
        this.duration = duration;
        this.startTime = startTime;
        this.finishTime = finishTime;
        this.isCritical = isCritical;
        this.totalTimeStock = totalTimeStock;
        this.freeTimeStock = freeTimeStock;
    }
}
