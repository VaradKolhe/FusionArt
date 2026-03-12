package com.RESTAPI.ArtGalleryProject.service.AdminService;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.Entity.WithdrawalRequest;
import com.RESTAPI.ArtGalleryProject.Enum.PaintingStatus;
import com.RESTAPI.ArtGalleryProject.repository.PaintingRepo;
import com.RESTAPI.ArtGalleryProject.repository.UnverifiedPaintingRepo;
import com.RESTAPI.ArtGalleryProject.repository.UserRepo;
import com.RESTAPI.ArtGalleryProject.repository.WithdrawalRequestRepo;
import com.RESTAPI.ArtGalleryProject.service.OrderService.EmailService;
import com.RESTAPI.ArtGalleryProject.service.WalletService.WalletService;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private UnverifiedPaintingRepo unverifiedRepo;
    @Autowired
    private PaintingRepo paintingRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private WithdrawalRequestRepo withdrawalRequestRepo;
    @Autowired
    private WalletService walletService;
    @Autowired
    private EmailService emailService;

    @Override
    public List<UnverifiedPainting> getPendingPaintings() {
        logger.info("getPendingPaintings started.");
        List<UnverifiedPainting> pendingList = unverifiedRepo.findByStatus(PaintingStatus.PENDING);
        logger.info("getPendingPaintings finished. {} paintings found.", pendingList.size());
        return pendingList;
    }

    @Override
    public String approvePainting(Long id) {
        logger.info("approvePainting started for painting ID: {}", id);

        var optional = unverifiedRepo.findById(id);
        if (optional.isEmpty()) {
            logger.warn("Painting with ID {} not found in unverified repository.", id);
            return "Painting not found";
        }

        var unverified = optional.get();
        var seller = userRepo.findById(unverified.getSellerId()).orElse(null);
        if (seller == null) {
            logger.warn("Seller with ID {} not found for painting ID {}.", unverified.getSellerId(), id);
            return "Seller not found";
        }

        var painting = new Painting();
        painting.setTitle(unverified.getTitle());
        painting.setDescription(unverified.getDescription());
        painting.setLength(unverified.getLength());
        painting.setBreadth(unverified.getBreadth());
        painting.setStartingPrice(unverified.getStartingPrice());
        painting.setFinalPrice(0.0); // Set default final price
        painting.setImageUrl(unverified.getImageUrl());
        painting.setForAuction(unverified.isForAuction());
        painting.setSeller(seller);
        painting.setSold(false);

        paintingRepo.save(painting);
        unverifiedRepo.deleteById(id);

        logger.info("Painting with ID {} approved and moved to verified painting table.", id);
        String response = painting.isForAuction() ? 
        		"Painting approved and moved to auction.": 
        		"Painting approved and moved to Shop.";
        return response;
    }

    @Override
    public String rejectPainting(Long id) {
        logger.info("rejectPainting started for painting ID: {}", id);

        if (!unverifiedRepo.existsById(id)) {
            logger.warn("Painting with ID {} not found during rejection.", id);
            return "Painting not found";
        }

        unverifiedRepo.deleteById(id);
        logger.info("Painting with ID {} successfully rejected and deleted.", id);
        return "Painting rejected and deleted.";
    }

    // Withdrawal Request methods
    @Override
    public List<WithdrawalRequest> getPendingWithdrawalRequests() {
        logger.info("getPendingWithdrawalRequests started.");
        List<WithdrawalRequest> allRequests = withdrawalRequestRepo.findByStatus("PENDING");
        logger.info("getPendingWithdrawalRequests finished. {} total requests found.", allRequests.size());
        
        // Log each request for debugging
        for (WithdrawalRequest request : allRequests) {
            logger.info("Request ID: {}, Email: {}, Amount: {}, Status: {}", 
                request.getId(), request.getUserEmail(), request.getAmount(), request.getStatus());
        }
        
        return allRequests;
    }

    public String approveWithdrawalRequest(Long id) {
        logger.info("approveWithdrawalRequest started for request ID: {}", id);

        var optional = withdrawalRequestRepo.findById(id);
        if (optional.isEmpty()) {
            logger.warn("Withdrawal request with ID {} not found.", id);
            return "Withdrawal request not found";
        }

        var request = optional.get();

        // Check if user exists and has sufficient balance
        var user = request.getUser();
        if (user == null) {
            logger.warn("User with ID {} not found for withdrawal request ID {}.", request.getUser().getUserId(), id);
            return "User not found";
        }

        if (user.getWallet().getBalance() < request.getAmount()) {
            logger.warn("Insufficient balance for user ID {} in withdrawal request ID {}.", user.getUserId(), id);
            return "Insufficient balance";
        }

        try {
            // Deduct amount
            walletService.decrementBalanceByEmail(request.getUserEmail(), request.getAmount());

            request.setStatus("APPROVED");
            withdrawalRequestRepo.save(request);

            // Prepare HTML email content
            String htmlContent = """
                <html>
                    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
                        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #2c3e50;">Withdrawal Approved ✅</h2>
                            <p>Hi <strong>%s</strong>,</p>
                            <p>Your withdrawal request has been approved and processed successfully.</p>

                            <div style="margin: 20px 0; padding: 15px; background-color: #f0f4f8; border-radius: 8px;">
                                <p style="margin: 0;"><strong>Order ID:</strong> %s</p>
                                <p style="margin: 0;"><strong>Amount Withdrawn:</strong> ₹%.2f</p>
                                <p style="margin: 0;"><strong>Status:</strong> Approved</p>
                            </div>

                            <p>The amount will reflect in your linked account shortly. If there are any issues, please <a href="#">contact our support</a>.</p>
                            <p style="margin-top: 30px;">Thank you for using <strong>Fusion Art Gallery</strong>,<br/>The Fusion Art Team</p>

                            <hr style="margin-top: 40px;" />
                            <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
                        </div>
                    </body>
                </html>
            """.formatted(user.getName(), request.getId(), request.getAmount());

            // Send email
            emailService.sendSimpleHtmlEmail(
                request.getUserEmail(),
                "Fusion Art - Withdrawal Approved ✅",
                htmlContent
            );

            logger.info("Withdrawal request with ID {} approved and email sent.", id);
            return "Withdrawal request approved and processed.";
        } catch (Exception e) {
            logger.error("Error processing withdrawal request ID {}: {}", id, e.getMessage());
            return "Error processing withdrawal request";
        }
    }


    @Override
    public String rejectWithdrawalRequest(Long id) {
        logger.info("rejectWithdrawalRequest started for request ID: {}", id);

        var optional = withdrawalRequestRepo.findById(id);
        if (optional.isEmpty()) {
            logger.warn("Withdrawal request with ID {} not found during rejection.", id);
            return "Withdrawal request not found";
        }

        var request = optional.get();
        var user = request.getUser();

        if (user == null) {
            logger.warn("User not found for withdrawal request ID {} during rejection.", id);
            return "User not found";
        }
        request.setStatus("REJECTED");
        withdrawalRequestRepo.save(request);

        String htmlContent = """
            <html>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #c0392b;">Withdrawal Rejected ❌</h2>
                        <p>Hi <strong>%s</strong>,</p>
                        <p>We're sorry to inform you that your withdrawal request could not be approved at this time.</p>

                        <div style="margin: 20px 0; padding: 15px; background-color: #fff4f4; border-radius: 8px;">
                            <p style="margin: 0;"><strong>Order ID:</strong> %s</p>
                            <p style="margin: 0;"><strong>Requested Amount:</strong> ₹%.2f</p>
                            <p style="margin: 0;"><strong>Status:</strong> Rejected</p>
                        </div>

                        <p>If you believe this was a mistake or have questions, please <a href="#">contact our support</a>.</p>
                        <p style="margin-top: 30px;">Thank you for using <strong>Fusion Art Gallery</strong>,<br/>The Fusion Art Team</p>

                        <hr style="margin-top: 40px;" />
                        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </body>
            </html>
            """.formatted(user.getName(), request.getId(), request.getAmount());

        try {
            emailService.sendSimpleHtmlEmail(
                request.getUserEmail(),
                "Withdrawal Request Rejected ❌",
                htmlContent
            );
        } catch (Exception e) {
            logger.error("Failed to send rejection email for withdrawal request ID {}: {}", id, e.getMessage());
        }

        logger.info("Withdrawal request with ID {} successfully rejected and deleted.", id);
        return "Withdrawal request rejected.";
    }

}
