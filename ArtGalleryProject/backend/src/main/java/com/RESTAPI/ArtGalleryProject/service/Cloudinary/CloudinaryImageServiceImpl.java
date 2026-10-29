package com.RESTAPI.ArtGalleryProject.service.Cloudinary;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

@Service
public class CloudinaryImageServiceImpl implements CloudinaryImageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;
    private static final long MAX_PIXELS = 40_000_000L;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/gif");

    private final Cloudinary cloudinary;
    private final String folder;

    public CloudinaryImageServiceImpl(Cloudinary cloudinary,
            @Value("${cloudinary.folder:fusionart/artworks}") String folder) {
        this.cloudinary = cloudinary;
        this.folder = folder;
    }

    @Override
    public StoredImage uploadArtwork(MultipartFile file) {
        validateImage(file);
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "resource_type", "image",
                    "folder", folder,
                    "use_filename", false,
                    "unique_filename", true,
                    "overwrite", false));
            String secureUrl = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");
            if (!StringUtils.hasText(secureUrl) || !secureUrl.startsWith("https://") || !StringUtils.hasText(publicId)) {
                throw new ImageStorageException("Cloudinary returned an incomplete image response.");
            }
            return new StoredImage(secureUrl, publicId);
        } catch (IOException e) {
            throw new ImageStorageException("Unable to upload the artwork image.", e);
        }
    }

    @Override
    public void deleteArtwork(String publicId) {
        if (!StringUtils.hasText(publicId)) {
            return; // Legacy local/S3 record: Cloudinary has nothing to remove.
        }
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, Map.of(
                    "resource_type", "image",
                    "invalidate", true));
            String status = String.valueOf(result.get("result"));
            if (!"ok".equalsIgnoreCase(status) && !"not found".equalsIgnoreCase(status)) {
                throw new ImageStorageException("Cloudinary could not delete the artwork image.");
            }
        } catch (IOException e) {
            throw new ImageStorageException("Unable to delete the artwork image from Cloudinary.", e);
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidImageException("An artwork image is required.");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new InvalidImageException("Artwork images must be 5 MB or smaller.");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new InvalidImageException("Only JPEG, PNG, and GIF artwork images are supported.");
        }
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null || image.getWidth() <= 0 || image.getHeight() <= 0
                    || (long) image.getWidth() * image.getHeight() > MAX_PIXELS) {
                throw new InvalidImageException("The uploaded file is not a supported image.");
            }
        } catch (IOException e) {
            throw new InvalidImageException("The uploaded file is not a readable image.");
        }
    }
}
