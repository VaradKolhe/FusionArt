package com.RESTAPI.ArtGalleryProject.Entity;

import java.time.LocalDateTime;

import com.RESTAPI.ArtGalleryProject.Enum.TransactionType;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-transactions")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransactionType type;

    private double amount;

    @ManyToOne
    @JoinColumn(name = "painting_id")
    @JsonBackReference(value = "painting-transactions")
    private Painting painting;

    private LocalDateTime timeStamp;
}
