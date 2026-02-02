package com.RESTAPI.ArtGalleryProject.service.DashBoard;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.PagePaintingResponse;
import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.PaintingResponse;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.RESTAPI.ArtGalleryProject.repository.PaintingRepo;
import com.RESTAPI.ArtGalleryProject.repository.UserRepo;

@Service
public class DashboardServiceImpl implements DashboardService{
	
	private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);
	
	@Autowired
	private PaintingRepo paintingRepo;
	@Autowired
	private UserRepo userRepo;

	@Override
	public PagePaintingResponse<PaintingResponse> getUpcomingPaintingsByPageAuction(int pageNo, int size) {
		logger.info("getPaintingsByPage started.");
		
		Pageable pageable = PageRequest.of(pageNo, size);
		Page<Painting> paintingsPage = paintingRepo.findByIsSoldFalseAndIsForAuctionTrueOrderByPaintingIdDesc(pageable);

		Page<PaintingResponse> pageResult = paintingsPage.map(p -> new PaintingResponse(
		    p.getPaintingId(),
		    p.getImageUrl(),
		    p.getTitle(),
		    p.getDescription(),
		    p.getLength(),
		    p.getBreadth(),
		    p.getStartingPrice(),
		    p.getFinalPrice(),
		    p.isForAuction(),
		    p.isSold(),
		    p.getSeller().getName()
		));
		
		logger.info("getPaintingsByPage finished.");
		return new PagePaintingResponse<PaintingResponse>(
		        pageResult.getContent(),
		        pageResult.getNumber(),
		        pageResult.getSize(),
		        pageResult.getTotalElements(),
		        pageResult.getTotalPages(),
		        pageResult.isLast()
		    );
	}

	@Override
	public PagePaintingResponse<PaintingResponse> getPaintingsByPageShop(int pageNo, int size) {
logger.info("getPaintingsByPage started.");
		
		Pageable pageable = PageRequest.of(pageNo, size);
		Page<Painting> paintingsPage = paintingRepo.findByIsSoldFalseAndIsForAuctionFalseOrderByPaintingIdDesc(pageable);

		Page<PaintingResponse> pageResult = paintingsPage.map(p -> new PaintingResponse(
	        p.getPaintingId(),
	        p.getImageUrl(),
	        p.getTitle(),
	        p.getDescription(),
	        p.getLength(),
	        p.getBreadth(),
	        p.getStartingPrice(),
	        p.getFinalPrice(),
	        p.isForAuction(),
	        p.isSold(),
	        p.getSeller().getName()
	    ));
		
		logger.info("getPaintingsByPage finished.");
		return new PagePaintingResponse<PaintingResponse>(
		        pageResult.getContent(),
		        pageResult.getNumber(),
		        pageResult.getSize(),
		        pageResult.getTotalElements(),
		        pageResult.getTotalPages(),
		        pageResult.isLast()
		    );
	}
	
	@Override
	public PaintingResponse getPaintingById(long id) {
		logger.info("getPaintingById started.");
		Painting painting = paintingRepo.findById(id).orElse(null);
		if(painting==null) {
			logger.info("getPaintingById finished.");
			return null;
		}
		logger.info("getPaintingById finished.");
		return new PaintingResponse(
				painting.getPaintingId(),
		        painting.getImageUrl(),
		        painting.getTitle(),
		        painting.getDescription(),
		        painting.getLength(),
		        painting.getBreadth(),
		        painting.getStartingPrice(),
		        painting.getFinalPrice(),
		        painting.isForAuction(),
		        painting.isSold(),
		        painting.getSeller().getName()
		);
	}

	@Override
	public Object walletBalance(long id) {
		logger.info("walletBalance started.");
		Optional<User> userOptional = userRepo.findById(id);
		if(userOptional.isEmpty()) {
			logger.info("walletBalance finished.");
			return "user not found";
		}
		User user = userOptional.get();
		logger.info("walletBalance finished.");
		return user.getWallet().getBalance();
	}
	
}
