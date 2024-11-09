package sia.tasks_manager.algorithm;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class Event {
    private int earliestStartTime;
    private int latestStartTime;
    private List<Process> startFor;
    private List<Process> finishFor;
    private static int amountOfEvents = 0;
    private int id;

    public Event(int earliestStartTime, int latestStartTime) {
        this();
        this.earliestStartTime = earliestStartTime;
        this.latestStartTime = latestStartTime;
    }

    public Event() {
        id = ++amountOfEvents;
        startFor = new ArrayList<>();
        finishFor = new ArrayList<>();
    }

    public void addStartForProcess(Process process) {
        startFor.add(process);
    }

    public void addFinishForProcess(Process process) {
        finishFor.add(process);
    }

    public void removeStartForProcess(Process process) {
        startFor.remove(process);
    }

    public void removeFinishForProcess(Process process) {
        finishFor.remove(process);
    }

    public int slackTime() {
        return latestStartTime - earliestStartTime;
    }
}
