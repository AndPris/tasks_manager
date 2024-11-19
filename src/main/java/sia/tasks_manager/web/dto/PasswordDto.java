package sia.tasks_manager.web.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PasswordDto {
    @NotEmpty
    @NotNull
    private String newPassword;
    private String matchPassword;
    private String token;
}
