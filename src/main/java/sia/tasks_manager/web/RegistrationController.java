package sia.tasks_manager.web;

import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import sia.tasks_manager.data.User;
import sia.tasks_manager.repositories.UserRepository;
import sia.tasks_manager.data.RegistrationForm;
import sia.tasks_manager.services.UserService;
import sia.tasks_manager.validation.exceptions.UserAlreadyExistException;

@Controller
@RequestMapping("/register")
public class RegistrationController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public RegistrationController(UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @GetMapping
    public String registerForm(Model model) {
        model.addAttribute("registrationForm", new RegistrationForm());
        return "registration";
    }

    @PostMapping
    public String processRegistration(Model model, @ModelAttribute("registrationForm") @Valid RegistrationForm registrationForm,
                                            Errors errors) {
        if(errors.hasErrors())
            return "registration";

        try {
            User registered = userService.registerNewUserAccount(registrationForm);
            return "redirect:/login";
        } catch (UserAlreadyExistException uaeEx) {
            model.addAttribute("message", "An account for that email already exists.");
            return "registration";
        }

//        return new ModelAndView("successRegister", "user", registrationForm);
//        if(errors.hasErrors())
//            return "registration";
//
//        return "redirect:/login";
    }
}
