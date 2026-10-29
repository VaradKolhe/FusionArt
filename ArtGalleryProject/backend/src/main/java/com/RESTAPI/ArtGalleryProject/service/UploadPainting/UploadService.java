package com.RESTAPI.ArtGalleryProject.service.UploadPainting;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.UploadPaintingRequest;

public interface UploadService {
	String uploadPainting(long userId, UploadPaintingRequest request);
}
