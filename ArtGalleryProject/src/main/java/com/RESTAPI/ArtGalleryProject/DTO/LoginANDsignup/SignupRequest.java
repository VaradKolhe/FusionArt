package com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup;

import jakarta.validation.constraints.Email;

public record SignupRequest(
		@Email
		String email, 
		String password,  
		String confirmPassword, 
		String securityQuestion,
		String securityAnswer
) {}