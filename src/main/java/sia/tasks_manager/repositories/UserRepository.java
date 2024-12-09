package sia.tasks_manager.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import sia.tasks_manager.data.User;

@RestResource(exported = false)
public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(String username);

    @Query(value = "SELECT u.username FROM User u JOIN Task t ON t.user=u WHERE t.id=:taskId")
    String findUsernameByTaskId(Long taskId);
}
