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

@Service
public class UploadServiceImpl implements UploadService {

    private static final Logger logger = LoggerFactory.getLogger(UploadServiceImpl.class);

    @Autowired
    private UnverifiedPaintingRepo unverifiedRepo;

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
        name = randomUID.concat(name.substring(name.lastIndexOf(".")));

        String filepath = path + "/" + name;

        File f = new File(path);
        if (!f.exists()) f.mkdir();

        Files.copy(file.getInputStream(), Paths.get(filepath));

        UnverifiedPainting painting = new UnverifiedPainting();
        painting.setTitle(request.title());
        painting.setDescription(request.description());
        painting.setLength(request.length());
        painting.setBreadth(request.breadth());
        painting.setStartingPrice(request.price());
        painting.setSellerId(userId);
        painting.setForAuction(request.isForAuction());
        painting.setImageUrl("/image/" + name);

        unverifiedRepo.save(painting);
        logger.info("uploadPainting finished.");
        return "Painting submitted. Awaiting admin approval.";
    }
}