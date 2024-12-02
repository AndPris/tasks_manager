package sia.tasks_manager.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import sia.tasks_manager.algorithm.Process;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class Subtask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 1, max = 30, message = "Must be from 1 to 50 characters")
    private String description;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Task task;

    @NotNull
    @Min(value = 1, message = "Duration must be 1 day or more")
    private int duration;

    @NotNull
    private boolean done;

    @ManyToMany
    @JoinTable(
            name = "subtask_dependencies",
            joinColumns = @JoinColumn(name = "subtask_id"),
            inverseJoinColumns = @JoinColumn(name = "previous_subtask_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<Subtask> previousSubtasks = new HashSet<>();

    private int startTime;
    private int finishTime;
    private boolean critical;
    private int totalTimeStock;
    private int freeTimeStock;

    @PrePersist
    protected void onCreate() {
        this.done = false;
    }

    public int getAmountOfPreviousSubtasks() {
        return previousSubtasks.size();
    }

    public void update(Process process) {
        this.startTime = process.getStart().getEarliestStartTime();
        this.finishTime = process.getFinish().getLatestStartTime();
        this.critical = process.isCritical();
        this.totalTimeStock = process.totalTimeStock();
        this.freeTimeStock = process.freeTimeStock();
    }
}
