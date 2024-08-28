package sia.tasks_manager.data;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE, force=true)
@RequiredArgsConstructor
public class Priority {
    @Id
    private final Long id;

    @NotNull
    private final String name;
}
