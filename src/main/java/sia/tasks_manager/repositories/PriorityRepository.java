package sia.tasks_manager.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import sia.tasks_manager.data.Priority;

@RestResource(exported = false)
public interface PriorityRepository extends CrudRepository<Priority, Long> {
}
