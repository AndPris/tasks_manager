package sia.tasks_manager.data;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthorData {
    private String name;
    private String description;
    private String photoPath;
    private String currentPage;
}
