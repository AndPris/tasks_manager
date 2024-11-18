package sia.tasks_manager.notification;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.data.User;
import sia.tasks_manager.repositories.TaskRepository;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    private final TaskRepository taskRepository;
    private final EmailService emailService;

    public NotificationService(TaskRepository taskRepository, EmailService emailService) {
        this.taskRepository = taskRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendNotifications() {
        sendTomorrowDeadlineNotifications();
        sendTodayDeadlineNotifications();
        sendDeadlineExpiredNotifications();
    }

    private void sendTomorrowDeadlineNotifications() {
        Date nextDay = getDateWithShift(new Date(), 1);
        List<Task> tasksDueTomorrow = taskRepository.findByFinishDateAndDone(nextDay, false);

        for (Task task : tasksDueTomorrow) {
            User user = task.getUser();
            if (user != null)
                sendEmail("Reminder: Task Deadline Approaching", user, task, "is due tomorrow");
        }
    }

    private void sendTodayDeadlineNotifications() {
        Date currentDate = new Date();
        List<Task> tasksDueToday = taskRepository.findByFinishDateAndDone(currentDate, false);

        for (Task task : tasksDueToday) {
            User user = task.getUser();
            if (user != null)
                sendEmail("Reminder: Task Deadline Approaching", user, task, "is due today");
        }
    }

    private void sendDeadlineExpiredNotifications() {
        Date previousDay = getDateWithShift(new Date(), -1);
        List<Task> tasksDueTomorrow = taskRepository.findByFinishDateAndDone(previousDay, false);

        for (Task task : tasksDueTomorrow) {
            User user = task.getUser();
            if (user != null)
                sendEmail("Reminder: Task Deadline Expired", user, task, "was due yesterday");
        }
    }

    private Date getDateWithShift(Date currentDate, int shift) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_YEAR, shift);
        return calendar.getTime();
    }

    private void sendEmail(String subject, User user, Task task, String deadlineState) {
        String fullName = user.getFullName();
        String taskDescription = task.getDescription();
        emailService.sendNotificationEmail(user.getUsername(), subject, fullName, taskDescription, deadlineState);
    }
}
