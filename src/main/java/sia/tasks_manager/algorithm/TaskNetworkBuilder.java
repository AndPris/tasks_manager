package sia.tasks_manager.algorithm;

import org.springframework.stereotype.Service;
import sia.tasks_manager.data.Subtask;
import sia.tasks_manager.data.Task;
import sia.tasks_manager.repositories.SubtaskRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TaskNetworkBuilder {
    private final SubtaskRepository subtaskRepository;

    public TaskNetworkBuilder(SubtaskRepository subtaskRepository) {
        this.subtaskRepository = subtaskRepository;
    }

    public TaskNetwork build(Task task) {
        List<Subtask> subtasks = subtaskRepository.findAllByTaskIdOrderById(task.getId());
        TaskNetwork network = new TaskNetwork(task);
        Map<Subtask, Process> subtaskProcesses = getSubtasksProcessesMap(subtasks);

        Event taskStart = new Event(0, 0);
        Event taskFinish = new Event();
        for (Subtask subtask : subtasks) {
            Process process = subtaskProcesses.get(subtask);

            if(subtask.getAmountOfPreviousSubtasks() == 0) {
                process.setStart(taskStart);
            } else {
                Event event = new Event();
                for (Subtask previousSubtask : subtask.getPreviousSubtasks())
                    subtaskProcesses.get(previousSubtask).setFinish(event);
                process.setStart(event);
            }

            process.setFinish(taskFinish);
        }

        network.setStart(taskStart);
        network.setFinish(taskFinish);
        return network;
    }

    private Map<Subtask, Process> getSubtasksProcessesMap(List<Subtask> subtasks) {
        Map<Subtask, Process> subtasksProcesses = new HashMap<>();
        for(Subtask subtask : subtasks)
            subtasksProcesses.put(subtask, new Process(subtask));
        return subtasksProcesses;
    }
}
