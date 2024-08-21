package sia.tasks_manager.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Controller
@RequestMapping("/tasks")
public class TasksController {
    @GetMapping
    public String loadPage(Model model) {
        model.addAttribute("currentDate", new Date());
        return "index";
    }
}