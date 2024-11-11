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

    @Scheduled(cron = "0 13 20 * * *")
    public void sendNotifications() {
        System.out.println("=================================================");
        System.out.println("Sending notifications");
        sendTomorrowDeadlineNotifications();
        sendTodayDeadlineNotifications();
        sendDeadlineExpiredNotifications();
        System.out.println("=================================================");
    }

    private void sendTomorrowDeadlineNotifications() {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        Date nextDay = calendar.getTime();

        List<Task> tasksDueTomorrow = taskRepository.findByFinishDateAndDone(nextDay, false);

        for (Task task : tasksDueTomorrow) {
            User user = task.getUser();
            if (user != null) {
                String subject = "Reminder: Task Deadline Approaching";
                String text = "Hello " + user.getFullName() + ",\n\n" +
                        "This is a reminder that your task \"" + task.getDescription() +
                        "\" is due tomorrow.\n\n" +
                        "Please make sure to complete it in time.\n\n" +
                        "Best regards,\nYour Task Manager App";
                emailService.sendEmail(user.getUsername(), subject, text);
            }
        }
    }

    private void sendTodayDeadlineNotifications() {
        Date currentDate = new Date();
        List<Task> tasksDueToday = taskRepository.findByFinishDateAndDone(currentDate, false);

        for (Task task : tasksDueToday) {
            User user = task.getUser();
            if (user != null) {
                String subject = "Reminder: Task Deadline Approached";
                String text = "Hello " + user.getFullName() + ",\n\n" +
                        "This is a reminder that your task \"" + task.getDescription() +
                        "\" is due today.\n\n" +
                        "Please make sure to complete it in time.\n\n" +
                        "Best regards,\nYour Task Manager App";
                emailService.sendEmail(user.getUsername(), subject, text);
            }
        }
    }

    private void sendDeadlineExpiredNotifications() {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        Date previousDay = calendar.getTime();

        List<Task> tasksDueTomorrow = taskRepository.findByFinishDateAndDone(previousDay, false);

        for (Task task : tasksDueTomorrow) {
            User user = task.getUser();
            if (user != null) {
                String subject = "Reminder: Task Deadline Expired";
                String text = "Hello " + user.getFullName() + ",\n\n" +
                        "This is a reminder that deadline of your task \"" + task.getDescription() +
                        "\" has expired.\n\n" +
                        "Please make sure to complete it.\n\n" +
                        "Best regards,\nYour Task Manager App";
                emailService.sendEmail(user.getUsername(), subject, text);
            }
        }
    }
}
