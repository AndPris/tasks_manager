package sia.tasks_manager.listeners;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import sia.tasks_manager.data.User;
import sia.tasks_manager.events.OnRegistrationCompleteEvent;
import sia.tasks_manager.notification.EmailService;
import sia.tasks_manager.services.UserService;

import java.util.UUID;

@Component
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {
    private final UserService userService;
    private final EmailService emailService;

    public RegistrationListener(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        this.confirmRegistration(event);
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        userService.createVerificationToken(user, token);

        String recipientAddress = user.getUsername();
        String subject = "Registration Confirmation";
        String confirmationUrl
                = event.getApprovalUrl() + "/registrationConfirm?token=" + token;
        String message = "Confirmation url: " + confirmationUrl;

        emailService.sendEmail(recipientAddress, subject, message);
    }
}
