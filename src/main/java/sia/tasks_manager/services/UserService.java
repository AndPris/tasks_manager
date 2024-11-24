package sia.tasks_manager.services;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sia.tasks_manager.data.tokens.imp.PasswordResetToken;
import sia.tasks_manager.data.RegistrationForm;
import sia.tasks_manager.data.User;
import sia.tasks_manager.data.tokens.imp.VerificationToken;
import sia.tasks_manager.repositories.PasswordResetTokenRepository;
import sia.tasks_manager.repositories.UserRepository;
import sia.tasks_manager.repositories.VerificationTokenRepository;
import sia.tasks_manager.validation.exceptions.UserAlreadyExistException;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       VerificationTokenRepository verificationTokenRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
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

    public User findUserByEmail(String email) {
        return userRepository.findByUsername(email);
    }

    public void createPasswordResetTokenForUser(User user, String token) {
        Optional<PasswordResetToken> optionalPasswordResetToken = passwordResetTokenRepository.findByUserId(user.getId());
        PasswordResetToken passwordResetToken;
        if (optionalPasswordResetToken.isPresent()) {
            passwordResetToken = optionalPasswordResetToken.get();
            passwordResetToken.updateToken(token);
        } else {
            passwordResetToken = new PasswordResetToken(token, user);
        }
        passwordResetTokenRepository.save(passwordResetToken);
    }

    public Optional<User> getUserByPasswordResetToken(String token) {
        return Optional.ofNullable(passwordResetTokenRepository.findByToken(token).getUser());
    }

    public void changeUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
