package com.RESTAPI.ArtGalleryProject.DTO.UploadPainting;

import java.util.List;

public record PagePaintingResponse<T>(
		List<T> content,
		int pageNumber,
		int pageSize,
		long totalElements,
	    int totalPages,
	    boolean last
) {}
