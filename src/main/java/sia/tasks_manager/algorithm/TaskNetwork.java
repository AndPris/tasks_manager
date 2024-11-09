package sia.tasks_manager.algorithm;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

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
    }

    private void calculateEarliestTimes(Event event, List<Event> visited) {
        if(visited.contains(event))
            return;
        visited.add(event);

        for(Process process : event.getStartFor()) {
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

    public List<ProcessDTO> convertToProcessDTOs() {
        List<ProcessDTO> processDTOs = new ArrayList<>();
        List<Event> visited = new ArrayList<>();
        getProcessDTOs(start, visited, processDTOs);
        return processDTOs;
    }

    private void getProcessDTOs(Event event, List<Event> visited, List<ProcessDTO> processDTOs) {
        if (visited.contains(event))
            return;
        visited.add(event);

        for (Process process : event.getStartFor())
            processDTOs.add(new ProcessDTO(process.getId(), process.getDescription(), process.getStart().getEarliestStartTime(),
                                            process.getFinish().getLatestStartTime(), process.isCritical(),
                                            process.totalTimeStock(), process.freeTimeStock()));

        for(Process process : event.getStartFor())
            getProcessDTOs(process.getFinish(), visited, processDTOs);
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

        for(Process process : event.getStartFor()) {
            Event finish = process.getFinish();
            String output = String.format("ES - %d; LS - %d; slack - %d; process - %s; duration - %d; critical - %b; EF - %d; LF - %d; slack - %d; TF - %d; FF - %d",
                    event.getEarliestStartTime(), event.getLatestStartTime(), event.slackTime(),
                    process.getDescription(), process.getDuration(), process.isCritical(),
                    finish.getEarliestStartTime(), finish.getLatestStartTime(), finish.slackTime(),
                    process.totalTimeStock(), process.freeTimeStock());
            System.out.println(output);
        }

        for(Process process : event.getStartFor())
            display(process.getFinish(), visited);
    }
}
