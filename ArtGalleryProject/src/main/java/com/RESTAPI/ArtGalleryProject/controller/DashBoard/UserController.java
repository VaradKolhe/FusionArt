package com.RESTAPI.ArtGalleryProject.controller.DashBoard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.UserDetailRequest;
import com.RESTAPI.ArtGalleryProject.security.AuthHelper;
import com.RESTAPI.ArtGalleryProject.service.DashBoard.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private AuthHelper authHelper;

	@Autowired
	private UserService service;

	@GetMapping("/profile")
	public ResponseEntity<?> getUserProfile() {
		logger.info("getUserProfile started.");
		long userId = authHelper.getCurrentUserId();
		String email = authHelper.getCurrentEmail();
		Object response = service.getUserDetials(userId, email);
		if (response instanceof String) {
			switch ((String) response) {
			case "User not found":
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
			default:
				return new ResponseEntity<>("Unexpected error occured", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		logger.info("getUserProfile finished.");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/profile-update")
	public ResponseEntity<?> updateUserProfile(@RequestBody UserDetailRequest request) {
		logger.info("updateUserProfile started.");
		long userId = authHelper.getCurrentUserId();
		String response = service.updateUserDetails(request, userId);
		switch (response) {
		case "Internal error occurred":
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		case "User info updated":
			return new ResponseEntity<>(response, HttpStatus.OK);
		default:
			logger.info("updateUserProfile finished.");
			throw new IllegalArgumentException("Unexpected value: " + response);
		}
	}
}