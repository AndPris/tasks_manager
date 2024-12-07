package sia.tasks_manager;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import sia.tasks_manager.algorithm.heuristic.imp.DeadlinePriorityTasksArrangementHeuristic;
import sia.tasks_manager.data.Task;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DeadlinePriorityTasksArrangementHeuristicTests {
    private DeadlinePriorityTasksArrangementHeuristic heuristic;
    private Calendar calendar;
    private Date creationTime;
    private Task task1;
    private Task task2;
    private Task task3;
    private Task task4;
    private Map<Task, Integer> tasksWithDuration;

    @BeforeEach
    void setUp() {
        heuristic = new DeadlinePriorityTasksArrangementHeuristic();

        calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.DECEMBER, 7);
        creationTime = calendar.getTime();

        task1 = getTask(2024, Calendar.DECEMBER, 17);
        task2 = getTask(2024, Calendar.DECEMBER, 25);
        task3 = getTask(2024, Calendar.DECEMBER, 29);
        task4 = getTask(2024, Calendar.DECEMBER, 30);
        tasksWithDuration = new HashMap<>();
    }

    private Task getTask(int year, int month, int day) {
        Task task = new Task();
        task.setCreationTime(creationTime);
        task.setEarliestPossibleStartTime(creationTime);

        calendar.set(year, month, day);
        Date finishDate = calendar.getTime();
        task.setFinishDate(finishDate);

        return task;
    }

    @Test
    void test1() {
        tasksWithDuration.put(task1, 8);
        tasksWithDuration.put(task2, 5);

        heuristic.arrangeTasks(tasksWithDuration);

        assertEquals(creationTime, task1.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 16);
        assertEquals(calendar.getTime(), task2.getEarliestPossibleStartTime());
    }


    @Test
    void test2() {
        tasksWithDuration.put(task1, 8);
        tasksWithDuration.put(task2, 5);
        tasksWithDuration.put(task3, 12);

        heuristic.arrangeTasks(tasksWithDuration);

        assertEquals(creationTime, task1.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 16);
        assertEquals(calendar.getTime(), task2.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 17);
        assertEquals(calendar.getTime(), task3.getEarliestPossibleStartTime());
    }

    @Test
    void test3() {
        tasksWithDuration.put(task1, 5);
        tasksWithDuration.put(task2, 5);
        tasksWithDuration.put(task3, 10);
        tasksWithDuration.put(task4, 15);

        heuristic.arrangeTasks(tasksWithDuration);

        assertEquals(creationTime, task1.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 13);
        assertEquals(calendar.getTime(), task2.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 19);
        assertEquals(calendar.getTime(), task3.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 15);
        assertEquals(calendar.getTime(), task4.getEarliestPossibleStartTime());
    }

    @Test
    void test4() {
        tasksWithDuration.put(task1, 5);
        tasksWithDuration.put(task2, 20);
        tasksWithDuration.put(task3, 3);
        tasksWithDuration.put(task4, 5);

        heuristic.arrangeTasks(tasksWithDuration);

        assertEquals(creationTime, task1.getEarliestPossibleStartTime());
        assertEquals(creationTime, task2.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 26);
        assertEquals(calendar.getTime(), task3.getEarliestPossibleStartTime());
        calendar.set(2024, Calendar.DECEMBER, 25);
        assertEquals(calendar.getTime(), task4.getEarliestPossibleStartTime());
    }
}
