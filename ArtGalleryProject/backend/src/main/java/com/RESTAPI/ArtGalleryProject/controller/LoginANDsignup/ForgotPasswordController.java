package com.RESTAPI.ArtGalleryProject.controller.LoginANDsignup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.CheckAnswerRequest;
import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.ForgotPasswordRequest;
import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.GetQuestionRequest;
import com.RESTAPI.ArtGalleryProject.service.loginANDsignup.LoginService;

@RestController
@RequestMapping("/auth/forgot-password")
public class ForgotPasswordController {

	private static final Logger logger = LoggerFactory.getLogger(ForgotPasswordController.class);

	@Autowired
	private LoginService service;

	private String emailPattern = "^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9.-]+$";
	private String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";

	@PostMapping(params = "step=check-email")
	public ResponseEntity<?> getSecurityQuestion(@RequestBody GetQuestionRequest request) {
		logger.info("getSecurityQuestion started.");
		if (!request.email().matches(emailPattern)) {
			logger.info("getSecurityQuestion finished.");
			return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
		}

		String response = service.getSecurityQuestion(request.email());
		logger.info("getSecurityQuestion finished.");
		switch (response) {
		case "Invalid Email":
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);

		default:
			return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
		}
	}

	@PostMapping(params = "step=verify-answer")
	public ResponseEntity<?> checkSecurityAnswer(@RequestBody CheckAnswerRequest request) {
		logger.info("checkSecurityAnswer started.");
		String response = service.checkSecurityAnswer(request.email(), request.answer());
		logger.info("checkSecurityAnswer finished.");
		switch (response) {
		case "Email not found":
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		case "Incorrect Answer":
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		case "Verification Success":
			return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
		default:
			return new ResponseEntity<>("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping(params = "step=password-reset")
	public ResponseEntity<?> passwordReset(@RequestBody ForgotPasswordRequest request) {
		logger.info("passwordReset started.");
		if (!request.email().matches(emailPattern)) {
			logger.info("passwordReset finished.");
			return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
		}

		if (!request.newPassword().matches(passwordPattern)) {
			logger.info("passwordReset finished.");
			return new ResponseEntity<>(
					"Password should contain atleast 8 characters, 1 capital letter, 1 small letter, 1 digit, and 1 special character",
					HttpStatus.BAD_REQUEST);
		}
		Object response = service.passwordReset(request.email(), request.newPassword(), request.confirmPassword());
		logger.info("passwordReset finished.");
		if (response instanceof String) {
			switch ((String)response) {
			case "Email not found":
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
			case "Passwords don't match":
				return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
			case "New password and current password are same":
				return new ResponseEntity<>(response, HttpStatus.CONFLICT);
			default:
				return new ResponseEntity<>("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
	}
}
