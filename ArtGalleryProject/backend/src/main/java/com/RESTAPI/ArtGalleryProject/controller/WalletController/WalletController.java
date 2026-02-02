package com.RESTAPI.ArtGalleryProject.controller.WalletController;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RESTAPI.ArtGalleryProject.security.AuthHelper;
import com.RESTAPI.ArtGalleryProject.service.WalletService.WalletService;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private static final Logger logger = LoggerFactory.getLogger(WalletController.class);

    @Autowired
    private AuthHelper authHelper;
    @Autowired
    private WalletService walletService;


    @GetMapping("/test")
    public ResponseEntity<?> testWallet() {
        logger.info("GET /wallet/test endpoint hit. Wallet controller is responsive.");
        return ResponseEntity.ok().body("Wallet controller is working!");
    }

    @GetMapping
    public ResponseEntity<?> getWallet() {
        String email = authHelper.getCurrentEmail();
        logger.info("GET /wallet - Request received for user: {}", email);
        
        Map<String, Object> map = walletService.getBalance(email);
        
        logger.info("Successfully retrieved wallet balance for user: {}", email);
        return ResponseEntity.ok().body(map);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> createWithdrawalRequest(@RequestBody Map<String, Object> request) {
        logger.info("POST /wallet/withdraw - Received new withdrawal request.");
        logger.debug("Request payload: {}", request);

        String email = authHelper.getCurrentEmail();
        long userId = authHelper.getCurrentUserId();

        try {
            Map<String, Object> response = walletService.processWithdrawalRequest(userId, email, request);
            return ResponseEntity.ok().body(response);
        } catch (NumberFormatException e) {
            logger.error("Invalid amount format: {}", e.getMessage());
            return ResponseEntity.status(400).body("Bad Request: Invalid format for 'amount'.");
        } catch (Exception e) {
            logger.error("Error creating withdrawal request: {}", e.getMessage());
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

}