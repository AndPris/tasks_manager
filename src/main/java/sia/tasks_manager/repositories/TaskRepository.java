package sia.tasks_manager.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import sia.tasks_manager.data.Task;

import java.util.Date;
import java.util.List;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long>, ListCrudRepository<Task, Long> {
    Iterable<Task> findByDescription(String description);
    Page<Task> findTasksByUserUsername(String username, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE DATE(t.finishDate) = DATE(:finishDate) AND t.done = :done")
    List<Task> findByFinishDateAndDone(@Param("finishDate") Date finishDate, @Param("done") boolean done);
//    Task findById(Long id);
}
