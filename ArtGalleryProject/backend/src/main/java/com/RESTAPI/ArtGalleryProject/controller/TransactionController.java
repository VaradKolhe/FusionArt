package com.RESTAPI.ArtGalleryProject.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RESTAPI.ArtGalleryProject.Entity.Transactions;
import com.RESTAPI.ArtGalleryProject.security.AuthHelper;
import com.RESTAPI.ArtGalleryProject.service.OrderService.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transactions>> getTransactionHistory() {
        long userId = authHelper.getCurrentUserId();
        logger.info("GET /transactions - Request received for user ID: {}", userId);
        
        List<Transactions> history = transactionService.getTransactionHistory(userId);
        
        logger.info("Successfully retrieved transaction history for user ID: {}", userId);
        return ResponseEntity.ok(history);
    }
}