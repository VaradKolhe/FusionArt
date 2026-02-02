package com.RESTAPI.ArtGalleryProject.repository;

import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.Enum.PaintingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnverifiedPaintingRepo extends JpaRepository<UnverifiedPainting, Long> {
    List<UnverifiedPainting> findByStatus(PaintingStatus status);
}