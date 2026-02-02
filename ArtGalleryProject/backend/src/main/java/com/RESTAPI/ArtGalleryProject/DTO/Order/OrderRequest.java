package com.RESTAPI.ArtGalleryProject.DTO.Order;

public record OrderRequest(
		String name,
		String email,
		double amount
) {}
