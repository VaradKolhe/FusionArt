package com.RESTAPI.ArtGalleryProject.controller.PaintingController;

import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.PlaceBidRequest;
import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.TopBidDTO;
import com.RESTAPI.ArtGalleryProject.security.AuthHelper;
import com.RESTAPI.ArtGalleryProject.service.Auction.BidService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auctions")
public class AuctionsController {

	private static final Logger logger = LoggerFactory.getLogger(AuctionsController.class);

	private boolean isAuctionLive = false;
	@Autowired
	private AuthHelper authHelper;
	@Autowired
	private BidService service;

	@PostMapping("/bid/{paintingId}")
	public ResponseEntity<?> placeBidcont(@PathVariable long paintingId, @RequestBody PlaceBidRequest request) {
		try {
			logger.info("placeBidcont started.");
			long userId = authHelper.getCurrentUserId();
			service.placeBid(userId, paintingId, request.bidAmount());
			logger.info("placeBidcont finished.");
			return ResponseEntity.ok("Bid placed successfully");
		} catch (RuntimeException e) {
			logger.info("placeBidcont finished with error.");
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/bid/{paintingId}")
	public ResponseEntity<List<TopBidDTO>> getTop3Bids(@PathVariable Long paintingId) {
		logger.info("getTop3Bids started.");
		List<TopBidDTO> topBids = service.getTop3BidsWithRank(paintingId);
		logger.info("getTop3Bids finished.");
		return ResponseEntity.ok(topBids);
	}

	@GetMapping("/live")
	@Transactional
	public ResponseEntity<?> auctionIsLive() {
		try {
			if (isAuctionLive) {
				return new ResponseEntity<>(Map.of("message", "Auction is already live."), HttpStatus.OK);
			} else {
				isAuctionLive = true;
				service.auctionStarts();
				return new ResponseEntity<>(Map.of("message", "Auction is now live."), HttpStatus.OK);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Unexpected Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/upcoming")
	@Transactional
	public ResponseEntity<?> auctionIsNotLive() {
		try {
//			logger.info("auctionIsNotLive started.");
			if (!isAuctionLive) {
//				logger.info("auctionIsNotLive finished.");
				return new ResponseEntity<>(Map.of("message", "Auction is already upcoming."), HttpStatus.OK);
			} else {
				isAuctionLive = false;
				service.auctionEnds();
				return new ResponseEntity<>(Map.of("message", "Auction has now ended."), HttpStatus.OK);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Unexpected Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
