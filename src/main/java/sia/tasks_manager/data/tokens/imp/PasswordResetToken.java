package sia.tasks_manager.data.tokens.imp;

import jakarta.persistence.*;
import sia.tasks_manager.data.User;
import sia.tasks_manager.data.tokens.Token;

@Entity
public class PasswordResetToken extends Token {
    public PasswordResetToken(String token, User user) {
        super(token, user);
    }

    public PasswordResetToken() {
        super();
    }
}
