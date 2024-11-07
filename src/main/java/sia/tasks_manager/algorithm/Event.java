package sia.tasks_manager.algorithm;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class Event {
    private int earliestStartTime;
    private int latestStartTime;
    private Set<Process> startFor;
    private Set<Process> finishFor;

    public Event(int earliestStartTime, int latestStartTime) {
        this();
        this.earliestStartTime = earliestStartTime;
        this.latestStartTime = latestStartTime;
    }

    public Event() {
        startFor = new HashSet<>();
        finishFor = new HashSet<>();
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
