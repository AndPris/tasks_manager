package sia.tasks_manager.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import sia.tasks_manager.data.User;

@RestResource(exported = false)
public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(String username);
}
