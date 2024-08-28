package sia.tasks_manager.preloading;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import sia.tasks_manager.data.Priority;
import sia.tasks_manager.repositories.PriorityRepository;

@Component
public class DataPreloader {

    @Bean
    public CommandLineRunner dataInitializer(PriorityRepository priorityRepository) {
        return args -> {
            priorityRepository.save(new Priority(1L, "High"));
            priorityRepository.save(new Priority(2L, "Medium"));
            priorityRepository.save(new Priority(3L, "Low"));
        };
    }
}
