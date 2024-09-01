package sia.tasks_manager.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import sia.tasks_manager.data.Task;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long>, CrudRepository<Task, Long> {
    Iterable<Task> findByDescription(String description);
    Page<Task> findTasksByUserUsername(String username, Pageable pageable);
}
