package sia.tasks_manager.data;

import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;

@Data
public class RegistrationForm {
    @Size(min = 4, message = "Username must be at least 4 characters long")
    private String username;

    @Size(min = 4, message = "Password must be at least 4 characters long")
    private String password;

    @Size(min = 4, message = "Full name must be at least 4 characters long")
    private String fullName;

    public User toUser(PasswordEncoder passwordEncoder) {
        return new User(username, passwordEncoder.encode(password), fullName);
    }
}
