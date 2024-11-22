package sia.tasks_manager.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 1, max = 50, message = "Must be from 1 to 50 characters")
    private String description;

    private Date finishDate;
    private Date creationTime;

    @NotNull
    private boolean done;

    @ManyToOne
    private Priority priority;

    @ManyToOne
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.done = false;
        this.creationTime = new Date();
    }
}
