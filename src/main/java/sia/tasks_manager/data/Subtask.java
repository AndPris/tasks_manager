package sia.tasks_manager.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

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
    private Set<Subtask> previousSubtasks = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.done = false;
    }

    public int getAmountOfPreviousSubtasks() {
        return previousSubtasks.size();
    }
}
