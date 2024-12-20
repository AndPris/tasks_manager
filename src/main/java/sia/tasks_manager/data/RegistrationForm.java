package sia.tasks_manager.data;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;
import sia.tasks_manager.validation.email.ValidEmail;
import sia.tasks_manager.validation.password.PasswordMatches;

@Data
@PasswordMatches
public class RegistrationForm {
    @NotNull
    @NotEmpty(message = "Provide first name")
    private String firstName;

    @NotNull
    @NotEmpty(message = "Provide last name")
    private String lastName;

    @ValidEmail
    private String email;

    @NotNull
    @NotEmpty(message = "Provide password")
    private String password;
    private String matchingPassword;

    public User toUser(PasswordEncoder passwordEncoder) {
        return new User(email, passwordEncoder.encode(password), firstName, lastName);
    }
}
