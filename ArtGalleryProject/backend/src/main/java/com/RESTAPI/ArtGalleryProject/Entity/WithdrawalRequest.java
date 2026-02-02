package com.RESTAPI.ArtGalleryProject.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WithdrawalRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private User user;
    
    private String userEmail;
    private Double amount;
    private String bankAccount;
    private String ifscCode;
    private String accountHolderName;
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    private LocalDateTime requestDate = LocalDateTime.now();
    private LocalDateTime processedDate;
    private String adminNotes;
} 