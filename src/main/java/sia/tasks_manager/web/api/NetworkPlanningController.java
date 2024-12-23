package sia.tasks_manager.web.api;

import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import sia.tasks_manager.algorithm.ProcessDTO;
import sia.tasks_manager.algorithm.TaskNetwork;
import sia.tasks_manager.algorithm.TaskNetworkBuilder;
import sia.tasks_manager.data.Subtask;

import java.util.List;

@RepositoryRestController
public class NetworkPlanningController {
    private final TaskNetworkBuilder taskNetworkBuilder;

    public NetworkPlanningController(TaskNetworkBuilder taskNetworkBuilder) {
        this.taskNetworkBuilder = taskNetworkBuilder;
    }

    @GetMapping("/tasks/plan/{taskId}")
    public ResponseEntity<?> createNetworkPlan(@PathVariable("taskId") Long taskId) {
        List<Subtask> plannedSubtasks = taskNetworkBuilder.build(taskId);
        return ResponseEntity.ok(plannedSubtasks);
    }

}
