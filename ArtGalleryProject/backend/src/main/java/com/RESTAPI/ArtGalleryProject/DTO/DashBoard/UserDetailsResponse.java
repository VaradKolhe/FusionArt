package com.RESTAPI.ArtGalleryProject.DTO.DashBoard;

import java.time.LocalDate;
import java.util.List;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.PaintingResponse;
import com.RESTAPI.ArtGalleryProject.Embeddable.Address;

public record UserDetailsResponse(
		Address address,
		String name,
		String email,
		String phoneNumber,
		LocalDate createdAt,
		List<PaintingResponse> paintingsSold,
		List<PaintingResponse> paintingsBought
) {}
