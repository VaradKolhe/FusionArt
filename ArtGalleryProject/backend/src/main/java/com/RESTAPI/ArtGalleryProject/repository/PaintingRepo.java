package com.RESTAPI.ArtGalleryProject.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.RESTAPI.ArtGalleryProject.Entity.Painting;

import jakarta.persistence.LockModeType;

@Repository
public interface PaintingRepo extends JpaRepository<Painting, Long> {
    Page<Painting> findByIsSoldFalseAndIsForAuctionTrueOrderByPaintingIdDesc(Pageable pageable);    // for Auctions
	Page<Painting> findByIsSoldFalseAndIsForAuctionFalseOrderByPaintingIdDesc(Pageable pageable);
	List<Painting> findByIsSoldFalseAndIsForAuctionTrue();	
	
	// for database locking system
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT p FROM Painting p WHERE p.isSold = false AND p.isForAuction = true")
	List<Painting> findActiveAuctionsWithLock();
}