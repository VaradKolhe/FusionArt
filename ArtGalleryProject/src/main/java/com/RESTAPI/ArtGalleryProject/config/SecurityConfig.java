package com.RESTAPI.ArtGalleryProject.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.RESTAPI.ArtGalleryProject.security.JwtAuthFilter;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

	@Autowired
	private JwtAuthFilter jwtAuthFilter;

	// Allow all requests and enable CORS
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		logger.info("securityFilterChain started.");
		http.cors(Customizer.withDefaults()) // enables CORS with default settings
				.csrf(csrf -> csrf.disable()) // disables CSRF
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/admin/**").hasRole("ADMIN")
						.requestMatchers(
								"/auctions/bid/**",
								"/user/profile",
								"/licenses/**",
								"/wallet/**",
								"/upload-painting")
						.authenticated()
						.requestMatchers("/createOrder", "/paymentCallback").permitAll()
						.anyRequest().permitAll())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		logger.info("securityFilterChain finished.");
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of(
			    "http://localhost:5173",
			    "http://localhost:5174",
			    "http://localhost:5175",
			    "http://127.0.0.1:5500"
			));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	// BCrypt password encoder bean
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
