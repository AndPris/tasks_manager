package sia.tasks_manager.services;

import org.springframework.stereotype.Service;
import sia.tasks_manager.data.tokens.imp.PasswordResetToken;
import sia.tasks_manager.repositories.PasswordResetTokenRepository;

import java.util.Calendar;

@Service
public class SecurityService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public SecurityService(PasswordResetTokenRepository passwordResetTokenRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public String validatePasswordResetToken(String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
        return !isTokenFound(passwordResetToken) ? "invalidToken"
                : isTokenExpired(passwordResetToken) ? "expired"
                : null;
    }

    private boolean isTokenFound(PasswordResetToken passwordResetToken) {
        return passwordResetToken != null;
    }

    private boolean isTokenExpired(PasswordResetToken passwordResetToken) {
        Calendar calendar = Calendar.getInstance();
        return passwordResetToken.getExpiryDate().before(calendar.getTime());
    }
}
