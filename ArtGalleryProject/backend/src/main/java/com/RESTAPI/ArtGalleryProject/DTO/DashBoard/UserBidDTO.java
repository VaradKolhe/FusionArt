package com.RESTAPI.ArtGalleryProject.DTO.DashBoard;

public record UserBidDTO(
		Long bidId,
		double bidAmount,
		String timeStamp
) {}
