package sia.tasks_manager.data;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE, force=true)
public class Priority {
    @Id
    private final Long id;

    @NotNull
    private String name;

    public Priority(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
