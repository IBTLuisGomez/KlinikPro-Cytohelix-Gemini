package systems.cytohelix.klinikpro.tenancy.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // API sin estado consumida por el frontend React, no por formularios
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/", "/index.html", "/favicon.ico").permitAll()
                        // /fhir/metadata publico a proposito: un cliente FHIR debe poder
                        // descubrir capacidades del servidor antes de tener token (igual que /auth/login).
                        .requestMatchers("/auth/login", "/actuator/health", "/actuator/info", "/fhir/metadata").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // No hay bean de AuthenticationManager/DaoAuthenticationProvider a proposito:
    // AuthService verifica el password directo contra AppUser.passwordHash con
    // PasswordEncoder (ver AuthService.login). Un DaoAuthenticationProvider sin
    // UserDetailsService configurado es un bean a medias que revienta en el
    // primer intento de uso — mejor no declararlo hasta que de verdad se
    // necesite un flujo de autenticacion basado en UserDetailsService.
}
