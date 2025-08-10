package com.RESTAPI.ArtGalleryProject.controller.AdminPanel;

import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.Entity.WithdrawalRequest;
import com.RESTAPI.ArtGalleryProject.service.AdminService.AdminService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    // 1. View all unverified paintings submitted by sellers
    @GetMapping("/paintings/unverified")
    public List<UnverifiedPainting> getUnverifiedPaintings() {
        logger.info("getUnverifiedPaintings calleds.");
        return adminService.getPendingPaintings();
    }

    // 2. Approve a painting → Move from UnverifiedPainting to Painting
    @PostMapping("/paintings/approve/{id}")
    public ResponseEntity<String> approvePainting(@PathVariable Long id) {
        logger.info("approvePainting called for id {}", id);
        String result = adminService.approvePainting(id);
        return result.contains("not") ? ResponseEntity.badRequest().body(result) : ResponseEntity.ok(result);
    }

    // 3. Reject a painting → Delete from UnverifiedPainting table
    @PostMapping("/paintings/reject/{id}")
    public ResponseEntity<String> rejectPainting(@PathVariable Long id) {
        logger.info("rejectPainting called for id {}", id);
        String result = adminService.rejectPainting(id);
        return result.contains("not") ? ResponseEntity.badRequest().body(result) : ResponseEntity.ok(result);
    }

    // 4. View all pending withdrawal requests
    @GetMapping("/withdrawals/pending")
    public List<WithdrawalRequest> getPendingWithdrawalRequests() {
        logger.info("getPendingWithdrawalRequests called.");
        List<WithdrawalRequest> requests = adminService.getPendingWithdrawalRequests();
        logger.info("Returning {} withdrawal requests to admin.", requests.size());
        return requests;
    }

    // 5. Approve a withdrawal request
    @PostMapping("/withdrawals/approve/{id}")
    public ResponseEntity<String> approveWithdrawalRequest(@PathVariable Long id) {
        logger.info("approveWithdrawalRequest called for id {}", id);
        String result = adminService.approveWithdrawalRequest(id);
        return result.contains("not") || result.contains("Error") ? ResponseEntity.badRequest().body(result) : ResponseEntity.ok(result);
    }

    // 6. Reject a withdrawal request
    @PostMapping("/withdrawals/reject/{id}")
    public ResponseEntity<String> rejectWithdrawalRequest(@PathVariable Long id) {
        logger.info("rejectWithdrawalRequest called for id {}", id);
        String result = adminService.rejectWithdrawalRequest(id);
        return result.contains("not") ? ResponseEntity.badRequest().body(result) : ResponseEntity.ok(result);
    }
}