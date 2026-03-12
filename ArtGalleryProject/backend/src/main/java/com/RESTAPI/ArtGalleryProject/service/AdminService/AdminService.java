package com.RESTAPI.ArtGalleryProject.service.AdminService;

import com.RESTAPI.ArtGalleryProject.Entity.UnverifiedPainting;
import com.RESTAPI.ArtGalleryProject.Entity.WithdrawalRequest;

import java.util.List;

public interface AdminService {
    List<UnverifiedPainting> getPendingPaintings();
    String approvePainting(Long id);
    String rejectPainting(Long id);
    
    // Withdrawal Request methods
    List<WithdrawalRequest> getPendingWithdrawalRequests();
    String approveWithdrawalRequest(Long id);
    String rejectWithdrawalRequest(Long id);
}
