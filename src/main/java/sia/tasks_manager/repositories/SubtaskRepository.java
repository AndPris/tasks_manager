package sia.tasks_manager.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import sia.tasks_manager.data.Subtask;

public interface SubtaskRepository extends PagingAndSortingRepository<Subtask, Long>, CrudRepository<Subtask, Long> {
    Page<Subtask> findSubtasksByTaskId(Long taskId, Pageable pageable);
}
