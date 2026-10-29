package com.RESTAPI.ArtGalleryProject.service.Cloudinary;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class ImageStorageException extends RuntimeException {
    public ImageStorageException(String message, Throwable cause) {
        super(message, cause);
    }

    public ImageStorageException(String message) {
        super(message);
    }
}
