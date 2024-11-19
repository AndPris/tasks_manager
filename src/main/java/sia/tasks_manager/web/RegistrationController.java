package sia.tasks_manager.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import sia.tasks_manager.data.User;
import sia.tasks_manager.events.OnRegistrationCompleteEvent;
import sia.tasks_manager.data.RegistrationForm;
import sia.tasks_manager.notification.EmailService;
import sia.tasks_manager.services.UserService;
import sia.tasks_manager.data.VerificationToken;
import sia.tasks_manager.validation.exceptions.UserAlreadyExistException;

import java.util.Calendar;

@Controller
@RequestMapping
public class RegistrationController {
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    private final UserService userService;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final EmailService emailService;

    public RegistrationController(UserService userService, ApplicationEventPublisher applicationEventPublisher, EmailService emailService) {
        this.userService = userService;
        this.applicationEventPublisher = applicationEventPublisher;
        this.emailService = emailService;
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        LOGGER.info("Rendering registration page.");
        model.addAttribute("registrationForm", new RegistrationForm());
        return "registration";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute("registrationForm") @Valid RegistrationForm registrationForm,
                                      Errors errors, Model model, HttpServletRequest request) {
        if(errors.hasErrors())
            return "registration";

        try {
            User registered = userService.registerNewUserAccount(registrationForm);
            final String approvalUrl = "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
            applicationEventPublisher.publishEvent(new OnRegistrationCompleteEvent(registered, approvalUrl));
            LOGGER.info("Begin registration confirmation process");
            return "redirect:/login";
        } catch (UserAlreadyExistException uaeEx) {
            LOGGER.info("User already exist");
            model.addAttribute("message", "An account for that email already exists.");
            return "registration";
        } catch (RuntimeException ex) {
            LOGGER.warn("Unable to register user", ex);
            model.addAttribute("user", registrationForm);
            return "emailError";
        }
    }

    @GetMapping("/registrationConfirm")
    public String confirmRegistration(WebRequest request, RedirectAttributes redirectAttributes, Model model, @RequestParam("token") String token) {
        VerificationToken verificationToken = userService.getVerificationToken(token);
        if(verificationToken == null) {
            LOGGER.info("Invalid token");
            redirectAttributes.addFlashAttribute("message", "Invalid verification token");
            return "redirect:/badUser";
        }

        User user = verificationToken.getUser();
        Calendar calendar = Calendar.getInstance();
        if((verificationToken.getExpiryDate().getTime() - calendar.getTime().getTime()) <=0 ) {
            LOGGER.info("Token expired");
            redirectAttributes.addFlashAttribute("message", "Verification token has expired");
            redirectAttributes.addFlashAttribute("expired", true);
            redirectAttributes.addFlashAttribute("token", token);
            return "redirect:/badUser";
        }

        user.setEnabled(true);
        userService.saveRegisteredUser(user);
        LOGGER.info("User account has been activated");
        redirectAttributes.addFlashAttribute("message", "Your account was activated");
        return "redirect:/login";
    }

    @GetMapping("/resendRegistrationToken")
    public String resendRegistrationToken(HttpServletRequest request, RedirectAttributes redirectAttributes,
                                          Model model, @RequestParam("token") String existingToken) {
        VerificationToken newToken = userService.generateNewVerificationToken(existingToken);
        User user = userService.getUser(newToken.getToken());

        try {
            String approvalUrl = "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
            sendResetVerificationTokenEmail(approvalUrl, newToken, user);
            LOGGER.info("Token is resent");
        } catch (final MailAuthenticationException e) {
            LOGGER.info("MailAuthenticationException", e);
            return "redirect:/emailError";
        } catch (final Exception e) {
            LOGGER.info(e.getLocalizedMessage(), e);
            return "redirect:/registration";
        }

        redirectAttributes.addFlashAttribute("message", "Your account was activated using new verification token");
        return "redirect:/login";
    }


    private void sendResetVerificationTokenEmail(String contextPath, VerificationToken newToken, User user) {
        String confirmationUrl = contextPath + "/registrationConfirm?token=" + newToken.getToken();
        String message = "New confirmation url: " + confirmationUrl;
        emailService.sendEmail(user.getUsername(), "Resend Registration Token", message);
    }
}
