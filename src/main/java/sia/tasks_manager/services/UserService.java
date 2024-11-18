package sia.tasks_manager.services;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sia.tasks_manager.data.RegistrationForm;
import sia.tasks_manager.data.User;
import sia.tasks_manager.repositories.UserRepository;
import sia.tasks_manager.validation.exceptions.UserAlreadyExistException;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerNewUserAccount(RegistrationForm registrationForm) throws UserAlreadyExistException {
        if (emailExists(registrationForm.getEmail())) {
            throw new UserAlreadyExistException("There is an account with that email address: "
                    + registrationForm.getEmail());
        }

        return userRepository.save(registrationForm.toUser(passwordEncoder));
    }

    private boolean emailExists(String email) {
        return userRepository.findByUsername(email) != null;
    }
}
