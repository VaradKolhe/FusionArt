package com.RESTAPI.ArtGalleryProject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Use absolute path for image directory for reliability
        // Example: "file:/C:/Users/Atharv/OneDrive/Desktop/Super30_clone_at_19-07-25/ArtGallery/ArtGalleryProject/image/"
        // Or use relative path if you always run from project root: "file:./image/"
        registry.addResourceHandler("/image/**")
                .addResourceLocations("file:./image/");
    }
    
}