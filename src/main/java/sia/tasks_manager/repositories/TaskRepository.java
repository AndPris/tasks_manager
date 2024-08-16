package sia.tasks_manager.repositories;

import org.springframework.data.repository.CrudRepository;
import sia.tasks_manager.data.Task;

public interface TaskRepository extends CrudRepository<Task, Long> {
}
