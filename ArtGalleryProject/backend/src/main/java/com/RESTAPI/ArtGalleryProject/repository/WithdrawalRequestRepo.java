package com.RESTAPI.ArtGalleryProject.repository;

import com.RESTAPI.ArtGalleryProject.Entity.WithdrawalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawalRequestRepo extends JpaRepository<WithdrawalRequest, Long> {
    List<WithdrawalRequest> findByStatus(String status);
    List<WithdrawalRequest> findByUserEmail(String userEmail);
} 