package com.RESTAPI.ArtGalleryProject.DTO.DashBoard;

public record PaintingCodOrWalletRequest(
	double amount,
	long paintingId,
	String mobile,
	String paymentMode,
	String address,
	String name
) {}
