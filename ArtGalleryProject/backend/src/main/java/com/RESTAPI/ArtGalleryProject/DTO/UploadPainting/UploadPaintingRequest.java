package com.RESTAPI.ArtGalleryProject.DTO.UploadPainting;

import org.springframework.web.multipart.MultipartFile;

public record UploadPaintingRequest (
	MultipartFile file,
	String title,
	String description,
	double length,
	double breadth,
	double price,
	boolean isForAuction
) {}
