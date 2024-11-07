package sia.tasks_manager.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import sia.tasks_manager.data.Subtask;

public interface SubtaskRepository extends PagingAndSortingRepository<Subtask, Long>, CrudRepository<Subtask, Long> {
    Page<Subtask> findSubtasksByTaskId(Long taskId, Pageable pageable);

    @Modifying
    @Query(value = "DELETE FROM subtask_dependencies WHERE subtask_id = ?1 OR previous_subtask_id = ?1", nativeQuery = true)
    void removeDependencies(@Param("subtaskId") Long subtaskId);
}
