package sia.tasks_manager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;
import sia.tasks_manager.data.User;
import sia.tasks_manager.repositories.UserRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> {
            User user = userRepository.findByUsername(username);
            if (user != null) return user;

            throw new UsernameNotFoundException("User '" + username + "' not found");
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.
                requestMatchers("/tasks/**").
                access(new WebExpressionAuthorizationManager("hasRole('USER')")).
                requestMatchers("/", "/**").access(new WebExpressionAuthorizationManager("permitAll()"))
        ).formLogin((form) -> form.
                loginPage("/login").
                defaultSuccessUrl("/tasks")
        ).logout((logout) -> logout.logoutSuccessUrl("/login?logout"));

        return http.build();
    }
}
