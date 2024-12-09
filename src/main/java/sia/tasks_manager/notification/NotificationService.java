package sia.tasks_manager.notification;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.data.User;
import sia.tasks_manager.repositories.SubtaskRepository;
import sia.tasks_manager.repositories.TaskRepository;

import java.util.Date;
import java.util.List;

import static sia.tasks_manager.utils.DateUtils.*;

@Service
public class NotificationService {
    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;
    private final EmailService emailService;
    private Date currentDate;

    public NotificationService(TaskRepository taskRepository, SubtaskRepository subtaskRepository, EmailService emailService) {
        this.taskRepository = taskRepository;
        this.subtaskRepository = subtaskRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendNotifications() {
        currentDate = new Date();

        sendTomorrowDeadlineNotifications();
        sendTodayDeadlineNotifications();
        sendDeadlineExpiredNotifications();
        sendSubtasksNotifications();
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

    private void sendEmail(String subject, User user, Task task, String deadlineState) {
        String fullName = user.getFirstName() + " " + user.getLastName();
        String taskDescription = task.getDescription();
        emailService.sendNotificationEmail(user.getUsername(), subject, fullName, taskDescription, deadlineState);
    }


    private void sendSubtasksNotifications() {
        List<Subtask> subtasks = subtaskRepository.findAllByDone(false);

        subtasks.stream().filter(subtask -> subtask.getFinishTime() != 0)
                .forEach((subtask) -> {
                    sendEarliestPossibleSubtaskStartNotification(subtask);
                    sendSubtaskStartWithoutShiftsNotification(subtask);
                    sendSubtaskMustHaveStartNotification(subtask);
                    sendSubtaskDeadlineNotification(subtask);
                });
    }

    private void sendEarliestPossibleSubtaskStartNotification(Subtask subtask) {
        if(subtask.isCritical())
            return;

        if(subtask.getFreeTimeStock() == 0 || subtask.getTotalTimeStock() == 0)
            return;

        Date earliestPossibleStartTime = getDateWithShift(subtask.getTask().getEarliestPossibleStartTime(), subtask.getStartTime());
        if(!isSameDate(earliestPossibleStartTime, currentDate))
            return;

        String to = getUsername(subtask);
        String subject = "Earliest possible start for subtask " + subtask.getDescription();
        String text = "Today you can start executions of subtask " + subtask.getDescription() +
                ". It's a part of " + subtask.getTask().getDescription() + " project.";
        emailService.sendEmail(to, subject, text);
    }

    private void sendSubtaskStartWithoutShiftsNotification(Subtask subtask) {
        if((subtask.getFreeTimeStock() == subtask.getTotalTimeStock()) || subtask.isCritical())
            return;

        Date startWithoutShifts = getDateWithShift(subtask.getTask().getEarliestPossibleStartTime(), subtask.getStartTime() + subtask.getFreeTimeStock());

        if(!isSameDate(startWithoutShifts, currentDate))
            return;

        String to = getUsername(subtask);
        String subject = "Start without time shifts for subtask " + subtask.getDescription();
        String text = "Today is the last day you can start executions of subtask " + subtask.getDescription() +
                " without any time shifts of execution next subtasks. It's a part of " + subtask.getTask().getDescription() + " project.";
        emailService.sendEmail(to, subject, text);
    }

    private void sendSubtaskMustHaveStartNotification(Subtask subtask) {
        Date mustHaveStart = getDateWithShift(subtask.getTask().getEarliestPossibleStartTime(), subtask.getStartTime() + subtask.getTotalTimeStock());

        if(!isSameDate(mustHaveStart, currentDate))
            return;

        String to = getUsername(subtask);
        String subject = "Last chance to start subtask " + subtask.getDescription() + " at time.";
        String text = "Today is the last chance you can start executions of subtask " + subtask.getDescription() +
                ". Otherwise you'll have to shift " + subtask.getTask().getDescription() + " project deadline.";
        emailService.sendEmail(to, subject, text);
    }

    private void sendSubtaskDeadlineNotification(Subtask subtask) {
        Date deadline = getDateWithShift(subtask.getTask().getEarliestPossibleStartTime(), subtask.getFinishTime());

        if(!isSameDate(deadline, currentDate))
            return;

        String to = getUsername(subtask);
        String subject = "Deadline of subtask " + subtask.getDescription();
        String text = "Today is the deadline of subtask " + subtask.getDescription() +
                ". Make sure to complete it. It's a part of " + subtask.getTask().getDescription() + " project";
        emailService.sendEmail(to, subject, text);
    }

    private String getUsername(Subtask subtask) {
        return subtask.getTask().getUser().getUsername();
    }
}
