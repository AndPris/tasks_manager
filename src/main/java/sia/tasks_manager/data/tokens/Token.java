package sia.tasks_manager.data.tokens;

import jakarta.persistence.*;
import lombok.Getter;
import sia.tasks_manager.data.User;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

@MappedSuperclass
public abstract class Token {
    protected final static int EXPIRATION = 24 * 60;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Getter
    protected String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    @Getter
    protected User user;

    @Getter
    protected Date expiryDate;

    protected Date calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Timestamp(cal.getTime().getTime()));
        cal.add(Calendar.MINUTE, expiryTimeInMinutes);
        return new Date(cal.getTime().getTime());
    }

    public Token() {
        super();
    }

    public Token(String token) {
        super();

        this.token = token;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    public Token(String token, User user) {
        super();

        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    public void updateToken(String token) {
        this.token = token;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }
}
