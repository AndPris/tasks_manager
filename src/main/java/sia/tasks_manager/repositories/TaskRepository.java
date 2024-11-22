package sia.tasks_manager.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import sia.tasks_manager.data.Task;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long>, ListCrudRepository<Task, Long> {
    Iterable<Task> findByDescription(String description);
    Iterable<Task> findTasksByUserUsername(String username);
    Optional<Task> findByIdAndUserUsername(Long id, String username);

    @Query("SELECT t FROM Task t WHERE DATE(t.finishDate) = DATE(:finishDate) AND t.done = :done")
    List<Task> findByFinishDateAndDone(@Param("finishDate") Date finishDate, @Param("done") boolean done);
}
