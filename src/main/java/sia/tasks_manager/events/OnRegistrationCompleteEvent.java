package sia.tasks_manager.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import sia.tasks_manager.data.User;

@Getter
public class OnRegistrationCompleteEvent extends ApplicationEvent {
    private final String approvalUrl;
    private final User user;

    public OnRegistrationCompleteEvent(
            User user, String approvalUrl) {
        super(user);

        this.user = user;
        this.approvalUrl = approvalUrl;
    }
}
