package com.fleetfix.fleetfix_service;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/cvip_uploads/**")
                .addResourceLocations("file:cvip_uploads");
    }
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/cvip_uploads/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET");
    }

}
