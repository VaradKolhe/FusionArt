package com.RESTAPI.ArtGalleryProject.controller.PaintingController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.UploadPaintingRequest;
import com.RESTAPI.ArtGalleryProject.security.AuthHelper;
import com.RESTAPI.ArtGalleryProject.service.UploadPainting.UploadService;

@RestController
public class UploadPaintingController {

	private static final Logger logger = LoggerFactory.getLogger(UploadPaintingController.class);

	@Autowired
	private AuthHelper authHelper;
	@Autowired
	private UploadService service;

	@PostMapping(value = "/upload-painting", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> upload(@ModelAttribute UploadPaintingRequest request) {
		logger.info("upload started.");
		long userId = authHelper.getCurrentUserId();
		String response = service.uploadPainting(userId, request);
		logger.info("upload finished.");
		return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
	}

}
