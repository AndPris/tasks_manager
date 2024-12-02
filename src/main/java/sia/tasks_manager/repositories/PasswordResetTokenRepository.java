package sia.tasks_manager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import sia.tasks_manager.data.tokens.imp.PasswordResetToken;

import java.util.Optional;

@RestResource(exported = false)
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    Optional<PasswordResetToken> findByUserId(Long userId);
//    void deleteByUserId(Long userId);
}
