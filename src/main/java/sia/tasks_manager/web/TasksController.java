package sia.tasks_manager.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.TaskRepository;

import java.time.LocalDate;

@Controller
@RequestMapping("/tasks")
public class TasksController {
    private final TaskRepository taskRepository;
    public TasksController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public String loadPage(Model model) {
        model.addAttribute("currentDate", LocalDate.now());
        return "index";
    }

    @GetMapping("/{taskId}/subtasks")
    public String viewSubtasksPage(@PathVariable Long taskId, Model model) {
        Task task = taskRepository.findById(taskId).get();
        model.addAttribute("taskId", taskId);
        model.addAttribute("description", task.getDescription());
        model.addAttribute("creationTime", task.getCreationTime());
        return "subtasks";
    }
}
