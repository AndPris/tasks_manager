package sia.tasks_manager.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import sia.tasks_manager.data.Subtask;

import java.util.List;

public interface SubtaskRepository extends PagingAndSortingRepository<Subtask, Long>, ListCrudRepository<Subtask, Long> {
    Page<Subtask> findSubtasksByTaskId(Long taskId, Pageable pageable);
    List<Subtask> findAllByTaskIdOrderById(Long taskId);
//    @Query(value = "SELECT s FROM subtask s JOIN Task t ON s.taskId=t.id JOIN User u ON t.userId=u.id WHERE u.username=:username")
//    List<Subtask> findAllByUserUsername(String username);
    List<Subtask> findAllByTask_User_Username(String username);
    Page<Subtask> findAllByTaskIdAndIdLessThan(Long taskId, Long id, Pageable pageable);

    @Modifying
    @Query(value = "DELETE FROM subtask_dependencies WHERE subtask_id = ?1 OR previous_subtask_id = ?1", nativeQuery = true)
    void removeDependencies(@Param("subtaskId") Long subtaskId);
}
