package com.RESTAPI.ArtGalleryProject.service.DashBoard;

import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.PagePaintingResponse;
import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.PaintingResponse;

public interface DashboardService {
	public PagePaintingResponse<PaintingResponse> getUpcomingPaintingsByPageAuction(int pageNo, int size);
	public PagePaintingResponse<PaintingResponse> getPaintingsByPageShop(int pageNo, int size);
	public PaintingResponse getPaintingById(long id);
	public Object walletBalance(long id);
}
