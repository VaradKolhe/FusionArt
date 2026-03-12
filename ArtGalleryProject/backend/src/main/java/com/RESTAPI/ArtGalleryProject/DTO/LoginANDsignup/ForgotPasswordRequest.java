package com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup;

public record ForgotPasswordRequest(
		String email,
		String newPassword,
		String confirmPassword
) {}
