package sia.tasks_manager.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;

@Controller
@RequestMapping("/tasks")
public class TasksController {
    @GetMapping
    public String loadPage(Model model) {
        model.addAttribute("currentDate", LocalDate.now());
        return "index";
    }

    @GetMapping("/{taskId}/subtasks")
    public String viewSubtasksPage(@PathVariable Long taskId, Model model) {
        model.addAttribute("taskId", taskId);
        return "subtasks";
    }
}
