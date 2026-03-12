package com.RESTAPI.ArtGalleryProject.controller.OrdersController;

import java.io.IOException;
import java.util.Map;

import javax.naming.directory.InvalidAttributeValueException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.PaintingCodOrWalletRequest;
import com.RESTAPI.ArtGalleryProject.DTO.Order.OrderRequest;
import com.RESTAPI.ArtGalleryProject.Entity.Orders;
import com.RESTAPI.ArtGalleryProject.security.AuthHelper;
import com.RESTAPI.ArtGalleryProject.service.OrderService.OrderService;
import com.razorpay.RazorpayException;

@Controller
public class OrdersController {

	private static final Logger logger = LoggerFactory.getLogger(OrdersController.class);

	@Autowired
	private AuthHelper authHelper;
	@Autowired
	private OrderService orderService;

	@GetMapping("/orders")
	public String ordersPage() {
		return "orders";
	}

	@PostMapping(value = "/createOrder", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) throws RazorpayException {
		logger.info("createOrder started.");
		Orders razorpayOrder = orderService.createOrder(request);
		logger.info("createOrder finished.");
		return new ResponseEntity<>(razorpayOrder, HttpStatus.CREATED);
	}

	@PostMapping("/paymentCallback")
	public String paymentCallback(@RequestParam Map<String, String> response) {
		orderService.updateStatusPayment(response);
		logger.info("paymentCallback finished.");
		return "success";
	}

	@PostMapping("/paymentCallbackCodOrWallet")
	public ResponseEntity<?> paymentCallback(@RequestBody PaintingCodOrWalletRequest request) {
		try {
			long userId = authHelper.getCurrentUserId();
			String email = authHelper.getCurrentEmail();

			String result = orderService.updateStatus(email, userId, request.amount(), request.paintingId(),
					request.mobile(), request.address(), request.paymentMode(), request.name());

			// Check for specific business logic messages from the service
			if ("Painting is already sold".equals(result)) {
				// Return a specific error for this known case
				return new ResponseEntity<>(result, HttpStatus.CONFLICT); // 409
			}

			logger.info("paymentCallback finished successfully.");
			return new ResponseEntity<>("success", HttpStatus.OK);

		} catch (InvalidAttributeValueException e) {
			// Handle specific, known exceptions with a clear error code
			logger.error("Validation error: {}", e.getMessage());
			return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST); // 400
		} catch (IOException e) {
			// Handle unexpected internal errors
			logger.error("Internal error during order processing:", e);
			return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}

	}

}