package com.RESTAPI.ArtGalleryProject.service.UploadPainting;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.UploadPaintingRequest;
import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.repository.UnverifiedPaintingRepo;
import com.RESTAPI.ArtGalleryProject.service.Cloudinary.CloudinaryImageService;
import com.RESTAPI.ArtGalleryProject.service.Cloudinary.StoredImage;

@Service
public class UploadServiceImpl implements UploadService {

    private static final Logger logger = LoggerFactory.getLogger(UploadServiceImpl.class);

    private final UnverifiedPaintingRepo unverifiedRepo;
    private final CloudinaryImageService cloudinaryImageService;

    public UploadServiceImpl(UnverifiedPaintingRepo unverifiedRepo, CloudinaryImageService cloudinaryImageService) {
        this.unverifiedRepo = unverifiedRepo;
        this.cloudinaryImageService = cloudinaryImageService;
    }

    @Override
    @Transactional
    public String uploadPainting(long userId, UploadPaintingRequest request) {
        StoredImage image = cloudinaryImageService.uploadArtwork(request.file());
        try {
            UnverifiedPainting painting = new UnverifiedPainting();
            painting.setTitle(request.title());
            painting.setDescription(request.description());
            painting.setLength(request.length());
            painting.setBreadth(request.breadth());
            painting.setStartingPrice(request.price());
            painting.setSellerId(userId);
            painting.setForAuction(request.isForAuction());
            painting.setImageUrl(image.secureUrl());
            painting.setCloudinaryPublicId(image.publicId());
            unverifiedRepo.save(painting);
            return "Painting submitted. Awaiting admin approval.";
        } catch (RuntimeException e) {
            try {
                cloudinaryImageService.deleteArtwork(image.publicId());
            } catch (RuntimeException cleanupFailure) {
                logger.error("Database persistence failed and Cloudinary cleanup also failed for public ID {}. Remove it manually.",
                        image.publicId(), cleanupFailure);
                e.addSuppressed(cleanupFailure);
            }
            throw e;
        }
    }
}
