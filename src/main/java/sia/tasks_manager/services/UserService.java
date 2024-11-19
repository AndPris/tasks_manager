package sia.tasks_manager.services;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sia.tasks_manager.data.RegistrationForm;
import sia.tasks_manager.data.User;
import sia.tasks_manager.data.VerificationToken;
import sia.tasks_manager.repositories.UserRepository;
import sia.tasks_manager.repositories.VerificationTokenRepository;
import sia.tasks_manager.validation.exceptions.UserAlreadyExistException;

import java.util.UUID;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, VerificationTokenRepository verificationTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationTokenRepository = verificationTokenRepository;
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

    public User getUser(String verificationToken) {
        return verificationTokenRepository.findByToken(verificationToken).getUser();
    }

    public VerificationToken getVerificationToken(String verificationToken) {
        return verificationTokenRepository.findByToken(verificationToken);
    }

    public void saveRegisteredUser(User user) {
        userRepository.save(user);
    }

    public void createVerificationToken(User user, String token) {
        VerificationToken myToken = new VerificationToken(token, user);
        verificationTokenRepository.save(myToken);
    }

    public VerificationToken generateNewVerificationToken(String existingToken) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(existingToken);
        verificationToken.updateToken(UUID.randomUUID().toString());
        return verificationTokenRepository.save(verificationToken);
    }
}
