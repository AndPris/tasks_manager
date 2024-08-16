package sia.tasks_manager.repositories;

import org.springframework.data.repository.CrudRepository;
import sia.tasks_manager.data.Priority;

public interface PriorityRepository extends CrudRepository<Priority, Long> {
}
