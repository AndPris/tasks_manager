package sia.tasks_manager.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("home");
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/badUser").setViewName("badUser");
        registry.addViewController("/updatePassword").setViewName("updatePassword");
        registry.addViewController("/forgotPassword").setViewName("forgotPassword");
    }
}
