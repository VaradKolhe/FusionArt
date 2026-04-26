package com.RESTAPI.ArtGalleryProject.service.OrderService;

import java.util.Map;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.RESTAPI.ArtGalleryProject.DTO.Order.OrderRequest;
import com.RESTAPI.ArtGalleryProject.Entity.LoginCredentials;
import com.RESTAPI.ArtGalleryProject.Entity.Orders;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.RESTAPI.ArtGalleryProject.repository.LoginCredRepo;
import com.RESTAPI.ArtGalleryProject.repository.OrdersRepo;
import com.RESTAPI.ArtGalleryProject.repository.PaintingRepo;
import com.RESTAPI.ArtGalleryProject.repository.UserRepo;
import com.RESTAPI.ArtGalleryProject.service.AwsSqsService;
import com.RESTAPI.ArtGalleryProject.service.WalletService.WalletService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

	private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

	@Autowired
	private OrdersRepo ordersRepository;
	@Autowired
	private PaintingRepo paintingRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private LoginCredRepo loginCredRepo;
	@Autowired
	private WalletService walletService;
	@Autowired
	private AwsSqsService sqsService;

	@Value("${razorpay.key.id}")
	private String razorpayId;
	@Value("${razorpay.key.secret}")
	private String razorpaySecret;

	private RazorpayClient razorpayCLient;

	@PostConstruct
	public void init() throws RazorpayException {
		this.razorpayCLient = new RazorpayClient(razorpayId, razorpaySecret);
	}

	@Override
	@Transactional
	public Orders createOrder(OrderRequest request) throws RazorpayException {
		logger.info("createOrder started for User email: {}", request.email());

		JSONObject options = new JSONObject();
		options.put("amount", request.amount() * 100);
		options.put("currency", "INR");
		options.put("receipt", request.email());
		Order razorpayOrder = razorpayCLient.orders.create(options);

		Orders order = new Orders();
		order.setCustomerName(request.name());
		order.setEmail(request.email());
		order.setAmount(request.amount());
		order.setRazorpayId(razorpayId);
		if (razorpayOrder != null) {
			order.setRazorpayOrderId(razorpayOrder.get("id"));
			order.setOrderStatus(razorpayOrder.get("status"));
		}

		logger.info("Saving order: name_len={}, email_len={}, rzpId_len={}, rzpOrderId_len={}", 
				order.getCustomerName() != null ? order.getCustomerName().length() : 0,
				order.getEmail() != null ? order.getEmail().length() : 0,
				order.getRazorpayId() != null ? order.getRazorpayId().length() : 0,
				order.getRazorpayOrderId() != null ? order.getRazorpayOrderId().length() : 0);

		logger.info("createOrder finished for Razorpay Order ID: {}", order.getRazorpayOrderId());
		return ordersRepository.save(order);
	}

	@Override
	@Transactional
	public Orders updateStatusPayment(Map<String, String> map) {
		String razorpayId = map.get("razorpay_order_id");

		if (razorpayId == null) {
			logger.error("razorpay_order_id is null in payment callback");
			throw new RuntimeException("Invalid payment callback - missing order ID");
		}

		Orders order = ordersRepository.findByRazorpayOrderId(razorpayId);
		if (order == null) {
			logger.error("Order not found for razorpay ID: {}", razorpayId);
			throw new RuntimeException("Order not found for payment callback");
		}

		order.setRazorpayPaymentId(map.get("razorpay_payment_id"));
		order.setOrderStatus("PAYMENT DONE");
		Orders savedOrder = ordersRepository.save(order);

		// Increment wallet balance
		if (order.getEmail() != null) {
			try {
				walletService.incrementBalanceByEmail(order.getEmail(), order.getAmount());
				logger.info("Wallet balance incremented for email: {}", order.getEmail());
			} catch (Exception e) {
				logger.error("Error incrementing wallet balance: {}", e.getMessage());
			}
		}

		// Publish SQS Notification
		if (order.getEmail() != null) {
			com.RESTAPI.ArtGalleryProject.DTO.NotificationEvent event = com.RESTAPI.ArtGalleryProject.DTO.NotificationEvent.builder()
					.type("PAYMENT_SUCCESS")
					.recipientEmail(order.getEmail())
					.recipientName(order.getCustomerName())
					.subject("✅ Payment Received - Fusion Art Gallery")
					.data(Map.of(
							"orderId", order.getOrderId(),
							"transactionId", order.getRazorpayPaymentId(),
							"amount", order.getAmount()
					))
					.build();
			sqsService.publishNotification(event);
		}

		logger.info("updateStatus finished successfully for order ID: {}", savedOrder.getOrderId());
		return savedOrder;
	}

	// Send Email With PDF
	@Override
	@Transactional
	public String updateStatus(String email, long userId, double amount, long paintingId, String mobileNumber,
			String address, String paymentMethod, String name)
			throws java.io.IOException, javax.naming.directory.InvalidAttributeValueException {
		logger.info("updateStatus started for User ID: {} and Painting ID: {}", userId, paintingId);

		Painting painting = paintingRepo.findById(paintingId)
				.orElseThrow(() -> new EntityNotFoundException("Painting not found with id: " + paintingId));

		// Check if painting is already sold
		if (painting.isSold()) {
			logger.warn("Painting {} is already sold", paintingId);
			return "Painting is already sold";
		}

		User buyer = userRepo.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
		LoginCredentials sellerLogin = loginCredRepo.findByUser(painting.getSeller())
				.orElseThrow(() -> new EntityNotFoundException("Seller for painting not found id: " + paintingId));
		Orders savedOrder;

		if (paymentMethod.equals("Pay with Wallet")) {
			double paintingPrice = painting.getStartingPrice();
			double currentBalance = buyer.getWallet().getBalance();

			if (currentBalance < paintingPrice) {
				logger.warn("Insufficient wallet balance for user {}. Required: {}, Available: {}", email,
						paintingPrice, currentBalance);
				throw new javax.naming.directory.InvalidAttributeValueException("Insufficient wallet balance, can't purchase the item.");
			}

			// Decrement wallet balance of buyer
			walletService.decrementBalanceByEmail(email, paintingPrice);
			// Increment wallet balance of seller
			walletService.incrementBalanceByEmail(sellerLogin.getEmail(), amount);

			// Create order record
			Orders order = new Orders();
			order.setCustomerName(buyer.getName());
			order.setEmail(email);
			order.setAmount(paintingPrice);
			order.setOrderStatus("PAID_WALLET");
			savedOrder = ordersRepository.save(order);
		} else {
			Orders order = new Orders();
			order.setCustomerName(buyer.getName());
			order.setAmount(amount);
			order.setEmail(email);
			order.setOrderStatus("PENDING_COD");
			savedOrder = ordersRepository.save(order);
		}

		// Mark painting as sold and set buyer
		painting.setSold(true);
		painting.setBuyer(buyer);
		painting.setFinalPrice(painting.getStartingPrice());
		paintingRepo.save(painting);

		// Publish SQS Notification for Order Confirmation
		com.RESTAPI.ArtGalleryProject.DTO.NotificationEvent event = com.RESTAPI.ArtGalleryProject.DTO.NotificationEvent.builder()
				.type("ORDER_CONFIRMATION")
				.recipientEmail(email)
				.recipientName(name)
				.subject("🎨 Your Fusion Art Order Confirmation (#" + savedOrder.getOrderId() + ")")
				.data(Map.of(
						"orderId", savedOrder.getOrderId(),
						"amount", amount,
						"paymentMethod", paymentMethod,
						"address", address,
						"mobileNumber", mobileNumber,
						"paintingTitle", painting.getTitle(),
						"paintingImageUrl", painting.getImageUrl()
				))
				.build();

		TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
		    @Override
		    public void afterCommit() {
		        logger.info("Transaction committed. Publishing Order Confirmation event to SQS for Order ID: {}",
		                savedOrder.getOrderId());
		        sqsService.publishNotification(event);
		    }
		});

		return "Order placed successfully — confirmation email will be sent shortly.";
	}

}