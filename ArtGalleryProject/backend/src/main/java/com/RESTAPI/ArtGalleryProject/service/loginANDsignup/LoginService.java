package com.RESTAPI.ArtGalleryProject.service.loginANDsignup;

import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.LoginRequest;
import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.SignupRequest;
import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.UserDetailRequest;

public interface LoginService {
	public Object register(SignupRequest request);
	public Object validateLogin(LoginRequest request);
	public String getSecurityQuestion(String Email);
	public String checkSecurityAnswer(String Email, String Answer);
	public Object passwordReset(String Email, String newPassword, String confirmPassword);
	public String acceptDetails(UserDetailRequest request, String email);
}
