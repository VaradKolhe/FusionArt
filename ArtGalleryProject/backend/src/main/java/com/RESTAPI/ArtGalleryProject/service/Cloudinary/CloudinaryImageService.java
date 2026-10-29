package com.RESTAPI.ArtGalleryProject.service.Cloudinary;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryImageService {
    StoredImage uploadArtwork(MultipartFile file);

    void deleteArtwork(String publicId);
}
