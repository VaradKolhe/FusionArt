package com.RESTAPI.ArtGalleryProject.service.Auction;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.TopBidDTO;
import com.RESTAPI.ArtGalleryProject.Entity.Bid;
import com.RESTAPI.ArtGalleryProject.Entity.LoginCredentials;
import com.RESTAPI.ArtGalleryProject.Entity.Orders;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.RESTAPI.ArtGalleryProject.Entity.Wallet;
import com.RESTAPI.ArtGalleryProject.repository.BidRepo;
import com.RESTAPI.ArtGalleryProject.repository.LoginCredRepo;
import com.RESTAPI.ArtGalleryProject.repository.OrdersRepo;
import com.RESTAPI.ArtGalleryProject.repository.PaintingRepo;
import com.RESTAPI.ArtGalleryProject.repository.UserRepo;
import com.RESTAPI.ArtGalleryProject.repository.WalletRepo;
import com.RESTAPI.ArtGalleryProject.service.OrderService.EmailService;
import com.RESTAPI.ArtGalleryProject.service.OrderService.PdfService;
import com.RESTAPI.ArtGalleryProject.service.WalletService.WalletService;
import com.lowagie.text.DocumentException;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class BidServiceImpl implements BidService {

	private static final Logger logger = LoggerFactory.getLogger(BidServiceImpl.class);

	@Autowired
	private BidRepo bidRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private PaintingRepo paintingRepo;
	@Autowired
	private WalletRepo walletRepo;
	@Autowired
	private OrdersRepo ordersRepo;
	@Autowired
	private LoginCredRepo loginCredRepo;
	@Autowired
	private PdfService pdfService;
	@Autowired
	private EmailService emailService;
	@Autowired
	private WalletService walletService;
	private String imageDirectory = "C:/Users/varad/OneDrive/Desktop/projects/Super30SpringProject/ArtGalleryProject";

	@Override
	@Transactional
	public void placeBid(long userId, long paintingId, double newBidAmount) {
		logger.info("placeBid started.");

		User buyer = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Painting painting = paintingRepo.findById(paintingId)
				.orElseThrow(() -> new RuntimeException("Painting not found"));

		if (!painting.isAuctionLive()) {
			logger.info("Auction ended cannot place bid for userId: {}.", buyer.getUserId());
			throw new RuntimeException("Auction has Ended");
		}

		Wallet buyerWallet = buyer.getWallet();
		Optional<Bid> currentHighestBidOpt = bidRepo.findTopByPaintingOrderByBidAmountDescTimeStampAsc(painting);

		if (currentHighestBidOpt.isPresent()) {
			double currentHighest = currentHighestBidOpt.get().getBidAmount();
			if (newBidAmount <= currentHighest) {
				logger.info("Insufficient amount.");
				throw new RuntimeException(
						"New bid must be strictly higher than current highest bid: " + currentHighest);
			}
		} else {
			double startingPrice = painting.getStartingPrice();
			if (newBidAmount < startingPrice) {
				logger.info("Insufficient amount.");
				throw new RuntimeException("First bid must be at least the starting price: " + startingPrice);
			}
		}

		// Find if the buyer already placed a bid on this painting
		Optional<Bid> existingUserBidOpt = bidRepo.findByPaintingAndBuyer(painting, buyer);

		if (existingUserBidOpt.isPresent()) {
			Bid existingBid = existingUserBidOpt.get();
			if (buyerWallet.getBalance() + existingBid.getBidAmount() < newBidAmount) {
				logger.info("placeBid finished.");
				throw new RuntimeException("Insufficient wallet balance.");
			}
			buyerWallet.setBalance(buyerWallet.getBalance() + existingBid.getBidAmount() - newBidAmount);

			existingBid.setBidAmount(newBidAmount);
			existingBid.setTimeStamp(LocalTime.now());

			walletRepo.save(buyerWallet);
			bidRepo.save(existingBid);
		} else {
			if (newBidAmount > buyerWallet.getBalance()) {
				logger.warn("Insufficient Funds");
				throw new RuntimeException("Insufficient balance in wallet: " + buyerWallet.getBalance());
			}

			if (currentHighestBidOpt.isPresent()) {
				Bid prevBid = currentHighestBidOpt.get();
				Wallet prevWallet = prevBid.getBuyer().getWallet();
				prevWallet.setBalance(prevWallet.getBalance() + prevBid.getBidAmount());
				walletRepo.save(prevWallet);
				logger.info("amount is refunded");
			}

			// Deduct from current buyer
			buyerWallet.setBalance(buyerWallet.getBalance() - newBidAmount);

			Bid newBid = new Bid();
			newBid.setBidAmount(newBidAmount);
			newBid.setBuyer(buyer);
			newBid.setPainting(painting);
			newBid.setTimeStamp(LocalTime.now());

			walletRepo.save(buyerWallet);
			bidRepo.save(newBid);
		}

		logger.info("placeBid finished.");
	}

	@Override
	public List<TopBidDTO> getTop3BidsWithRank(Long paintingId) {
		logger.info("getTop3BidsWithRank started.");
		Painting painting = paintingRepo.findById(paintingId)
				.orElseThrow(() -> new RuntimeException("Painting not found"));
		List<Bid> topBids = bidRepo.findTop3ByPaintingOrderByBidAmountDesc(painting);
		List<TopBidDTO> result = new ArrayList<>();
		int rank = 1;
		for (Bid bid : topBids) {
			result.add(new TopBidDTO(rank++, bid.getBuyer().getName(), bid.getBidAmount()));
		}
		logger.info("getTop3BidsWithRank finished.");
		return result;
	}

	@Transactional(isolation = Isolation.SERIALIZABLE)
	@Override
	public synchronized String auctionEnds() throws IOException, DocumentException, MessagingException {
		logger.info("auctionEnds started.");

		// get all locked paintings.
		List<Painting> livePaintings = paintingRepo.findActiveAuctionsWithLock();

		for (Painting painting : livePaintings) {
			painting.setAuctionLive(false);
			paintingRepo.save(painting);

			if (painting.isWinnerEmailSent())
				continue;
			Optional<Bid> highestBidderOpt = bidRepo.findTopByPaintingOrderByBidAmountDescTimeStampAsc(painting);
			if (highestBidderOpt.isEmpty())
				continue;

			Bid highestBidder = highestBidderOpt.get();
			List<Bid> allBids = bidRepo.findByPainting(painting);

			for (Bid bid : allBids) {
				User user = bid.getBuyer();
				LoginCredentials userCredentials = loginCredRepo.findByUser(user)
						.orElseThrow(() -> new EntityNotFoundException(
								"User not found for painting id: " + painting.getPaintingId()));

				if (bid.getBidAmount() == highestBidder.getBidAmount()) {
					// Winner
					LoginCredentials sellerLogin = loginCredRepo.findByUser(painting.getSeller())
							.orElseThrow(() -> new EntityNotFoundException(
									"Seller for painting not found id: " + painting.getPaintingId()));

					Orders order = new Orders();
					order.setName(user.getName());
					order.setEmail(userCredentials.getEmail());
					order.setAmount(highestBidder.getBidAmount());
					order.setOrderStatus("PAID_AUCTION");
					ordersRepo.save(order);

					walletService.incrementBalanceByEmail(sellerLogin.getEmail(), bid.getBidAmount());

					String subject = "🎨 Your Fusion Art Auction Confirmation (#" + order.getOrderId() + ")";
					String imageAbsolutePath = Paths.get(imageDirectory, painting.getImageUrl()).toString();
					String formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
					String htmlContent = """
							    <!DOCTYPE html>
							    <html lang="en">
							    <head>
							        <meta charset="UTF-8" />
							        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
							        <style>
							            body {
							                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
							                background-color: #f4f4f4;
							                margin: 0;
							                padding: 0;
							                color: #333;
							            }

							            .email-container {
							                max-width: 720px;
							                margin: 40px auto;
							                background-color: #ffffff;
							                border-radius: 16px;
							                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
							                overflow: hidden;
							            }

							            .header {
							                background: linear-gradient(90deg, #2c3e50, #34495e);
							                color: #fff;
							                padding: 30px 40px;
							                text-align: center;
							            }

							            .header h1 {
							                margin: 0;
							                font-size: 30px;
							                font-weight: bold;
							            }

							            .content {
							                padding: 40px 50px;
							                line-height: 1.7;
							                font-size: 16px;
							            }

							            .order-info {
							                display: flex;
							                justify-content: space-between;
							                margin-bottom: 35px;
							                padding-bottom: 25px;
							                border-bottom: 1px solid #e0e0e0;
							            }

							            .order-info div {
							                width: 48%%;
							            }

							            .order-info strong {
							                display: block;
							                color: #555;
							                font-weight: 600;
							                margin-bottom: 5px;
							            }

							            .item-table {
							                width: 100%%;
							                border-collapse: collapse;
							                margin-bottom: 35px;
							            }

							            .item-table th,
							            .item-table td {
							                padding: 16px;
							                border-bottom: 1px solid #e6e6e6;
							                text-align: center;
							                vertical-align: middle;
							            }

							            .item-table th {
							                background-color: #f0f4f8;
							                color: #444;
							                font-size: 15px;
							                font-weight: 600;
							            }

							            .item-image {
							                width: 200px;
							                border-radius: 10px;
							                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
							            }

							            .item-title {
							                font-weight: 600;
							                font-size: 16px;
							                color: #333;
							            }

							            .item-price {
							                font-size: 15px;
							                font-weight: 500;
							                color: #222;
							            }

							            .shipping-info {
							                background-color: #f9fafb;
							                padding: 25px;
							                border-radius: 10px;
							                margin-top: 30px;
							                font-size: 15px;
							            }

							            .footer {
							                text-align: center;
							                padding: 30px 40px;
							                background-color: #f1f5f9;
							                color: #888;
							                font-size: 13px;
							                border-top: 1px solid #ddd;
							            }

							            .footer a {
							                color: #2c3e50;
							                text-decoration: none;
							                margin: 0 10px;
							            }

							            .footer a:hover {
							                text-decoration: underline;
							            }
							        </style>
							    </head>
							    <body>
							        <div class="email-container">
							            <div class="header">
							                <h1>Congratulations! You Won the Auction 🎉</h1>
							            </div>
							            <div class="content">
							                <div class="order-info">
							                    <div>
							                        <strong>Order ID:</strong> #%d
							                        <strong>Date:</strong> %s
							                    </div>
							                    <div>
							                        <strong>Billed To:</strong> %s
							                        <strong>Contact Number:</strong> %s
							                    </div>
							                </div>

							                <table class="item-table">
							                    <thead>
							                        <tr>
							                            <th>Item</th>
							                            <th>Title</th>
							                            <th>Price</th>
							                        </tr>
							                    </thead>
							                    <tbody>
							                        <tr>
							                            <td><img src="cid:paintingImage" alt="%s" class="item-image" /></td>
							                            <td class="item-title">%s</td>
							                            <td class="item-price">₹%.2f</td>
							                        </tr>
							                    </tbody>
							                </table>

							                <div class="shipping-info">
							                    <p><strong>Payment Method:</strong> %s</p>
							                    <p><strong>Shipping Address:</strong><br>%s</p>
							                </div>

							                <p style="margin-top: 30px;">
							                    Thank you for being a part of this auction. Your receipt and invoice are attached. <br>
							                    We hope you enjoy your artwork and look forward to serving you again!
							                </p>
							            </div>

							            <div class="footer">
							                <p>&copy; %d Fusion Art. All Rights Reserved.<br/>
							                <a href="#">Visit Our Gallery</a> | <a href="#">Contact Us</a></p>
							            </div>
							        </div>
							    </body>
							    </html>
							"""
							.formatted(order.getOrderId(), // %d
									formattedDate, // %s
									user.getName(), // %s
									user.getPhoneNumber(), // %s
									painting.getTitle(), // %s (image alt)
									painting.getTitle(), // %s (title)
									order.getAmount(), // %.2f
									"Auction", // %s (payment mode)
									user.getAddress(), // %s
									Year.now().getValue() // %d (footer year)
							);
					TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
						@Override
						public void afterCommit() {
							logger.info("Transaction committed. Generating PDF and sending email for Order ID: {}",
									order.getOrderId());

							String pdfFilename = "FusionArt-Receipt-" + order.getOrderId() + ".pdf";

							try {
								CompletableFuture<byte[]> futureReceipt = pdfService.generateReceiptPdf(order, user,
										painting, imageDirectory, "Auction", user.getName(), user.getPhoneNumber(),
										user.getAddress().toString());

								futureReceipt.thenAccept(pdfReceipt -> {
									logger.info("Sending confirmation email with PDF attachment to: {}",
											userCredentials.getEmail());
									try {
										emailService.sendOrderConfirmationEmailCOD(userCredentials.getEmail(), subject,
												htmlContent, imageAbsolutePath, pdfReceipt, pdfFilename);
										logger.info("Order confirmation email sent successfully for Order ID: {}",
												order.getOrderId());
									} catch (MessagingException e) {
										logger.error("Email sending failed for Order ID: {}", order.getOrderId(), e);
									}
								}).exceptionally(ex -> {
									logger.error("Async PDF generation failed for Order ID: {}", order.getOrderId(),
											ex);
									return null;
								});

							} catch (IOException | DocumentException e) {
								logger.error("Failed to start async PDF generation for Order ID: {}",
										order.getOrderId(), e);
							}
						}
					});

				} else {
					// Non-winners
					String subject = "Auction Result: Thank You for Participating!";
					String content = """
							<html>
							<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
							    <div style="max-width: 600px; margin: auto; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
							        <h2 style="color: #333;">Thank you for your interest in "%s"</h2>
							        <p>Dear %s,</p>
							        <p>We appreciate your participation in the Fusion Art auction for "<strong>%s</strong>".</p>
							        <p>While your bid was not the highest, we hope you enjoyed the experience and will join us again in future auctions.</p>
							        <p>If you have any questions or would like to explore more artworks, please visit our <a href="#">gallery</a>.</p>
							        <p style="margin-top: 20px;">Warm regards,<br/>Fusion Art Team</p>
							    </div>
							</body>
							</html>
							"""
							.formatted(painting.getTitle(), user.getName(), painting.getTitle());

					logger.info("Sending non-winner email to: {}", userCredentials.getEmail());
					emailService.sendSimpleHtmlEmail(userCredentials.getEmail(), subject, content);
				}
			}

			painting.setSold(true);
			painting.setFinalPrice(highestBidder.getBidAmount());
			painting.setBuyer(highestBidder.getBuyer());
			painting.setWinnerEmailSent(true);
			paintingRepo.save(painting);
		}

		return "Auction processing completed.";
	}

	@Override
	public String auctionStarts() {
		try {
			logger.info("auctionStarts started.");

			// get all paintings to start auction.
			List<Painting> livePaintings = paintingRepo.findActiveAuctionsWithLock();
			
			for (Painting painting : livePaintings) {
				painting.setAuctionLive(true);
				paintingRepo.save(painting);
			}
			return "auction Started";
		} catch (Exception e) {
			logger.error("Some error occured");
			throw new RuntimeException("Some error occured");
		}
		
		
	}

}
