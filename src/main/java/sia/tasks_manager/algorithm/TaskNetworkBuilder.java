package sia.tasks_manager.algorithm;

import org.springframework.stereotype.Service;
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.repositories.SubtaskRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class TaskNetworkBuilder {
    private final SubtaskRepository subtaskRepository;

    public TaskNetworkBuilder(SubtaskRepository subtaskRepository) {
        this.subtaskRepository = subtaskRepository;
    }

    public TaskNetwork build(Long taskId) {
        List<Subtask> subtasks = subtaskRepository.findAllByTaskIdOrderById(taskId);
        TaskNetwork network = new TaskNetwork(taskId);
        Map<Subtask, Process> subtaskProcesses = getSubtasksProcessesMap(subtasks);

        Event taskStart = new Event(0, 0);
        Event taskFinish = new Event();
        for (Subtask subtask : subtasks) {
            Process process = subtaskProcesses.get(subtask);

            if(subtask.getAmountOfPreviousSubtasks() == 0) {
                process.setStart(taskStart);
            } else {
                Event start = getStart(subtask.getPreviousSubtasks(), subtaskProcesses);
                for (Subtask previousSubtask : subtask.getPreviousSubtasks())
                    subtaskProcesses.get(previousSubtask).setFinish(start);
                process.setStart(start);
            }
        }

        for (Subtask subtask : subtasks) {
            Process process = subtaskProcesses.get(subtask);
            if(process.getFinish() == null)
                process.setFinish(taskFinish);
        }

        network.setStart(taskStart);
        network.setFinish(taskFinish);
        network.calculateTimes();
        return network;
    }

    private Map<Subtask, Process> getSubtasksProcessesMap(List<Subtask> subtasks) {
        Map<Subtask, Process> subtasksProcesses = new HashMap<>();
        for(Subtask subtask : subtasks)
            subtasksProcesses.put(subtask, new Process(subtask));
        return subtasksProcesses;
    }

    private Event getStart(Set<Subtask> previousSubtasks, Map<Subtask, Process> subtaskProcesses) {
        for (Subtask previousSubtask : previousSubtasks) {
            if(subtaskProcesses.get(previousSubtask).getFinish() != null)
                return subtaskProcesses.get(previousSubtask).getFinish();
        }

        return new Event();
    }
}
