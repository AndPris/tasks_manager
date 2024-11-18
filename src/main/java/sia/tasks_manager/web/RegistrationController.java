package sia.tasks_manager.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import sia.tasks_manager.data.User;
import sia.tasks_manager.events.OnRegistrationCompleteEvent;
import sia.tasks_manager.repositories.UserRepository;
import sia.tasks_manager.data.RegistrationForm;
import sia.tasks_manager.services.UserService;
import sia.tasks_manager.data.VerificationToken;
import sia.tasks_manager.validation.exceptions.UserAlreadyExistException;

import java.util.Calendar;

@Controller
@RequestMapping
public class RegistrationController {

    private final UserService userService;
    private final ApplicationEventPublisher applicationEventPublisher;

    public RegistrationController(UserService userService, ApplicationEventPublisher applicationEventPublisher) {
        this.userService = userService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
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
            String approvalUrl = request.getContextPath();
            applicationEventPublisher.publishEvent(new OnRegistrationCompleteEvent(registered, approvalUrl));
            return "redirect:/login";
        } catch (UserAlreadyExistException uaeEx) {
            model.addAttribute("message", "An account for that email already exists.");
            return "registration";
        } catch (RuntimeException ex) {
            model.addAttribute("user", registrationForm);
            return "emailError";
        }
    }

    @GetMapping("/registrationConfirm")
    public String confirmRegistration(WebRequest request, Model model, @RequestParam("token") String token) {
        VerificationToken verificationToken = userService.getVerificationToken(token);
        if(verificationToken == null) {
            model.addAttribute("message", "Invalid verification token");
            return "redirect:/badUser";
        }

        User user = verificationToken.getUser();
        Calendar calendar = Calendar.getInstance();
        if((verificationToken.getExpiryDate().getTime() - calendar.getTime().getTime()) <=0 ) {
            model.addAttribute("message", "Verification token has expired");
            return "redirect:/badUser";
        }

        user.setEnabled(true);
        userService.saveRegisteredUser(user);
        return "redirect:/login";
    }
}
