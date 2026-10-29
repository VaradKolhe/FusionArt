package com.RESTAPI.ArtGalleryProject.service.Cloudinary;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import com.cloudinary.Cloudinary;

class CloudinaryImageServiceImplTest {

    @Test
    void rejectsUnsupportedContentTypeBeforeCallingCloudinary() {
        CloudinaryImageService service = new CloudinaryImageServiceImpl(mock(Cloudinary.class), "fusionart/artworks");
        MockMultipartFile file = new MockMultipartFile("file", "not-art.txt", "text/plain", "not an image".getBytes());

        assertThrows(InvalidImageException.class, () -> service.uploadArtwork(file));
    }
}
