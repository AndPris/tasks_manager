package sia.tasks_manager.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import sia.tasks_manager.data.Priority;

@RestResource(exported = false)
public interface PriorityRepository extends CrudRepository<Priority, Long> {
    @Query(value = "SELECT p.name FROM Priority p WHERE p.id=:id")
    String findNameById(Long id);
}
