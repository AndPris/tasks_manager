package sia.tasks_manager.algorithm;

import lombok.Data;
import org.springframework.security.core.parameters.P;
import sia.tasks_manager.data.Task;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class TaskNetwork {
    private final Long taskId;
    private Event start;
    private Event finish;

    public TaskNetwork(Long taskId) {
        this.taskId = taskId;
    }

    public void calculateTimes() {
        forwardPass();
        backwardPass();
    }

    private void forwardPass() {
        start.setEarliestStartTime(0);
        List<Event> visited = new ArrayList<>();
        calculateEarliestTimes(start, visited);
        System.out.println("Finish: " + finish.getEarliestStartTime());
    }

    private void calculateEarliestTimes(Event event, List<Event> visited) {
        if(visited.contains(event))
            return;
        visited.add(event);

        for(Process process : event.getStartFor()) {
            System.out.println("Event " + event.getId() + " ES " + event.getEarliestStartTime() + " process " + process.getDescription() + " duration " + process.getDuration());
            Event finishEvent = process.getFinish();
            int earliestStartTime = event.getEarliestStartTime();
            int earliestFinishTime = earliestStartTime + process.getDuration();

            finishEvent.setEarliestStartTime(Math.max(finishEvent.getEarliestStartTime(), earliestFinishTime));
        }

        for(Process process : event.getStartFor())
            calculateEarliestTimes(process.getFinish(), visited);

    }

    private void backwardPass() {
        finish.setLatestStartTime(finish.getEarliestStartTime());
        List<Event> visited = new ArrayList<>();
        calculateLatestTimes(finish, visited);
    }

    private void calculateLatestTimes(Event event, List<Event> visited) {
        if (visited.contains(event))
            return;
        visited.add(event);

        for (Process process : event.getFinishFor()) {
            Event startEvent = process.getStart();
            int latestFinishTime = event.getLatestStartTime();
            int latestStartTime = latestFinishTime - process.getDuration();

            if ((!startEvent.equals(start) && startEvent.getLatestStartTime() == 0) || startEvent.getLatestStartTime() > latestStartTime)
                startEvent.setLatestStartTime(latestStartTime);
        }

        for(Process process : event.getFinishFor())
            calculateLatestTimes(process.getStart(), visited);
    }

    //for test purpose
    public void display() {
        List<Event> visited = new ArrayList<>();
        display(start, visited);
    }

    private void display(Event event, List<Event> visited) {
        if(visited.contains(event))
            return;
        visited.add(event);

//        System.out.println(event.getId() + " start for:");
//        event.getStartFor().stream().map(Process::getDescription).forEach(System.out::println);
//        System.out.println("=======================================================");
        for(Process process : event.getStartFor()) {
            Event finish = process.getFinish();
            String output = String.format("ES - %d; LS - %d; slack - %d; process - %s; duration - %d; critical - %b; EF - %d; LF - %d, slack - %d",
                    event.getEarliestStartTime(), event.getLatestStartTime(), event.slackTime(),
                    process.getDescription(), process.getDuration(), process.isCritical(),
                    finish.getEarliestStartTime(), finish.getLatestStartTime(), finish.slackTime());
            System.out.println(output);
        }

        for(Process process : event.getStartFor())
            display(process.getFinish(), visited);
    }
}
