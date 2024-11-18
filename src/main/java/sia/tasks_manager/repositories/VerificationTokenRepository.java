package sia.tasks_manager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import sia.tasks_manager.data.User;
import sia.tasks_manager.data.VerificationToken;

@RestResource(exported = false)
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    VerificationToken findByUser(User user);
}
