package com.RESTAPI.ArtGalleryProject.service.UploadPainting;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.UploadPaintingRequest;
import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.repository.UnverifiedPaintingRepo;

import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class UploadServiceImpl implements UploadService {

    private static final Logger logger = LoggerFactory.getLogger(UploadServiceImpl.class);

    @Autowired
    private UnverifiedPaintingRepo unverifiedRepo;

    @Autowired(required = false)
    private S3Client s3Client;

    @Value("${app.image.s3-bucket:}")
    private String bucketName;

    @Value("${app.image.cdn-url:}")
    private String cdnUrl;

    @Override
    public String uploadPainting(long userId, String path, UploadPaintingRequest request) throws IOException {
        logger.info("uploadPainting started.");
        MultipartFile file = request.file();

        if (file.getSize() > 5 * 1024 * 1024) {
            logger.info("uploadPainting finished.");
            throw new MaxUploadSizeExceededException(5);
        }

        String name = file.getOriginalFilename();
        String randomUID = UUID.randomUUID().toString();
        String extension = name.substring(name.lastIndexOf("."));
        String fileName = randomUID.concat(extension);

        String imageUrl;

        if (bucketName != null && !bucketName.isEmpty() && s3Client != null) {
            logger.info("Uploading to S3 bucket: {}", bucketName);
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            // Construct absolute URL for S3/CDN
            if (cdnUrl != null && !cdnUrl.isEmpty()) {
                imageUrl = cdnUrl.endsWith("/") ? cdnUrl + fileName : cdnUrl + "/" + fileName;
            } else {
                imageUrl = String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
            }
        } else {
            logger.info("Uploading to local path: {}", path);
            String filepath = path + "/" + fileName;
            File f = new File(path);
            if (!f.exists()) f.mkdirs();
            Files.copy(file.getInputStream(), Paths.get(filepath));
            imageUrl = "/image/" + fileName;
        }

        UnverifiedPainting painting = new UnverifiedPainting();
        painting.setTitle(request.title());
        painting.setDescription(request.description());
        painting.setLength(request.length());
        painting.setBreadth(request.breadth());
        painting.setStartingPrice(request.price());
        painting.setSellerId(userId);
        painting.setForAuction(request.isForAuction());
        painting.setImageUrl(imageUrl);

        unverifiedRepo.save(painting);
        logger.info("uploadPainting finished.");
        return "Painting submitted. Awaiting admin approval.";
    }
}