package com.RESTAPI.ArtGalleryProject.service.OrderService;

import java.util.Map;

import javax.naming.directory.InvalidAttributeValueException;

import com.RESTAPI.ArtGalleryProject.DTO.Order.OrderRequest;
import com.RESTAPI.ArtGalleryProject.Entity.Orders;
import com.razorpay.RazorpayException;

public interface OrderService {
	public Orders updateStatusPayment(Map<String, String> map);
	public Orders createOrder(OrderRequest request) throws RazorpayException;
	public String updateStatus(String email, long userId, double amount, long paintingId,
			String mobileNumber, String Address, String paymentMethod, String name) 
					throws java.io.IOException, InvalidAttributeValueException;
}
