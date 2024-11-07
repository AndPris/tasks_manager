package sia.tasks_manager.algorithm;

import lombok.Data;
import sia.tasks_manager.data.Subtask;


@Data
public class Process {
    private Subtask subtask;
    private Event start;
    private Event finish;

    public Process(Subtask subtask) {
        this.subtask = subtask;
    }

    public int getDuration() {
        return subtask.getDuration();
    }

    public void setStart(Event start) {
        removeStart();
        this.start = start;
        start.addStartForProcess(this);
    }

    public void setFinish(Event finish) {
        removeFinish();
        this.finish = finish;
        finish.addFinishForProcess(this);
    }

    private void removeFinish() {
        if(finish == null)
            return;

        finish.removeFinishForProcess(this);
        finish = null;
    }

    private void removeStart() {
        if(start == null)
            return;

        start.removeStartForProcess(this);
        start = null;
    }
}
