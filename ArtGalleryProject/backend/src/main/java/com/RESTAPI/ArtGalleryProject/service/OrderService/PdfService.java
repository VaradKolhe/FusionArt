package com.RESTAPI.ArtGalleryProject.service.OrderService;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

import com.RESTAPI.ArtGalleryProject.Entity.Orders;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.lowagie.text.DocumentException;


public interface PdfService {
	public CompletableFuture<byte[]> generateReceiptPdf(Orders order, User user, Painting painting, String imageDirectory, 
    		String paymentMode, String name, String contactNumber, String address) throws DocumentException, IOException;
}
