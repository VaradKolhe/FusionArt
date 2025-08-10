package com.RESTAPI.ArtGalleryProject.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.RESTAPI.ArtGalleryProject.Enum.Role;

@Component
public class AuthHelper extends JwtService{
    public String getCurrentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? (Long) auth.getDetails() : null;
    }
    
    public Role getCurrentRole() {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? (Role) auth.getDetails() : null;
    }
}