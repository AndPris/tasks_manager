package sia.tasks_manager.repositories;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import sia.tasks_manager.data.Task;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long>, CrudRepository<Task, Long> {
    Page<Task> findAllByOrderByDoneAscPriorityAsc(Pageable pageable);
    Iterable<Task> findByDescription(String description);
}
