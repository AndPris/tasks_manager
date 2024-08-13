package sia.tasks_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class TasksManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TasksManagerApplication.class, args);
    }

}
