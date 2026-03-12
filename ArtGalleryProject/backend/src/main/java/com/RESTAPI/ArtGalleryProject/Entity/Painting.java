package com.RESTAPI.ArtGalleryProject.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Painting {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long paintingId;

	@Column(length = 2048, nullable = false)
	private String imageUrl;

	private String title;
	private String description;
	private double length;
	private double breadth;
	private double startingPrice;
	private double finalPrice = 0.0;
	private boolean isForAuction;
	private boolean isAuctionLive = false;
	private boolean isSold;
	private boolean winnerEmailSent = false;

	// --Relation tables

	// user sold painting
	@ManyToOne
	@JoinColumn(name = "seller_id", nullable = false)
	@JsonBackReference(value = "user-seller")
	private User seller;

	// user bought painting
	@ManyToOne
	@JoinColumn(name = "buyer_id")
	@JsonBackReference(value = "user-buyer")
	private User buyer;

	// bid on painting
	@OneToMany(mappedBy = "painting")
	@JsonManagedReference(value = "painting-bids")
	private List<Bid> bids;
}