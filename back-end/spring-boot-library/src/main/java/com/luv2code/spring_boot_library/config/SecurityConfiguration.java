package com.luv2code.spring_boot_library.config;

import com.okta.spring.boot.oauth.Okta;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http)
      throws Exception {
    http.csrf(
        csrf
        -> csrf.disable()); // Disable CSRF for simplicity; adjust as needed

    http.authorizeHttpRequests(
            configurer
            -> configurer
                   .requestMatchers(
                       "/api/books/secure/**", "/api/reviews/secure/**",
                       "/api/messages/secure/**", "/api/admin/secure/**")
                   .authenticated()
                   .anyRequest()
                   .permitAll())
        .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));

    // Add CORS configuration
    http.cors(Customizer.withDefaults());

    // Add content negotiation strategy
    http.setSharedObject(ContentNegotiationStrategy.class,
                         new HeaderContentNegotiationStrategy());

    // Force non-empty response body for 401
    Okta.configureResourceServer401ResponseBody(http);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(
        Arrays.asList("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
