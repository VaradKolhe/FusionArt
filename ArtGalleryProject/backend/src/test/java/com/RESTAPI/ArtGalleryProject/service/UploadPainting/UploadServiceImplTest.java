package com.RESTAPI.ArtGalleryProject.service.UploadPainting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.UploadPaintingRequest;
import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.repository.UnverifiedPaintingRepo;
import com.RESTAPI.ArtGalleryProject.service.Cloudinary.CloudinaryImageService;
import com.RESTAPI.ArtGalleryProject.service.Cloudinary.ImageStorageException;
import com.RESTAPI.ArtGalleryProject.service.Cloudinary.StoredImage;

@ExtendWith(MockitoExtension.class)
class UploadServiceImplTest {

    @Mock
    private UnverifiedPaintingRepo unverifiedRepo;
    @Mock
    private CloudinaryImageService cloudinaryImageService;
    @InjectMocks
    private UploadServiceImpl uploadService;

    @Test
    void savesSecureCloudinaryMetadataForSuccessfulUpload() {
        UploadPaintingRequest request = request();
        when(cloudinaryImageService.uploadArtwork(request.file()))
                .thenReturn(new StoredImage("https://res.cloudinary.com/test/image/upload/art.jpg", "fusionart/artworks/art"));

        assertEquals("Painting submitted. Awaiting admin approval.", uploadService.uploadPainting(42L, request));

        ArgumentCaptor<UnverifiedPainting> captor = ArgumentCaptor.forClass(UnverifiedPainting.class);
        verify(unverifiedRepo).save(captor.capture());
        assertEquals("https://res.cloudinary.com/test/image/upload/art.jpg", captor.getValue().getImageUrl());
        assertEquals("fusionart/artworks/art", captor.getValue().getCloudinaryPublicId());
    }

    @Test
    void cloudinaryFailureDoesNotPersistArtwork() {
        UploadPaintingRequest request = request();
        when(cloudinaryImageService.uploadArtwork(request.file()))
                .thenThrow(new ImageStorageException("Cloudinary unavailable"));

        assertThrows(ImageStorageException.class, () -> uploadService.uploadPainting(42L, request));
        verify(unverifiedRepo, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void persistenceFailureTriggersCloudinaryCleanup() {
        UploadPaintingRequest request = request();
        StoredImage stored = new StoredImage("https://res.cloudinary.com/test/image/upload/art.jpg", "fusionart/artworks/art");
        when(cloudinaryImageService.uploadArtwork(request.file())).thenReturn(stored);
        doThrow(new RuntimeException("database unavailable")).when(unverifiedRepo).save(any());

        assertThrows(RuntimeException.class, () -> uploadService.uploadPainting(42L, request));
        verify(cloudinaryImageService).deleteArtwork(stored.publicId());
    }

    private UploadPaintingRequest request() {
        return new UploadPaintingRequest(
                new MockMultipartFile("file", "art.jpg", "image/jpeg", new byte[] { 1, 2, 3 }),
                "Artwork", "Description", 10, 20, 100, false);
    }
}
