package com.RESTAPI.ArtGalleryProject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RESTAPI.ArtGalleryProject.Entity.Bid;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;

@Repository
public interface BidRepo extends JpaRepository<Bid, Long> {
	Optional<Bid> findTopByPaintingOrderByBidAmountDescTimeStampAsc(Painting painting);

	List<Bid> findTop3ByPaintingOrderByBidAmountDesc(Painting painting);
	
	Optional<Bid> findByPaintingAndBuyer(Painting painting, User buyer);
	
	List<Bid> findByPainting(Painting painting);
}