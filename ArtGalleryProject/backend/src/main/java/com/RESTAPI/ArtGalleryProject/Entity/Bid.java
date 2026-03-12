package com.RESTAPI.ArtGalleryProject.Entity;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class Bid {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bidId;

	@Column(nullable = false)
	private double bidAmount;

	@Column(nullable = false)
	private LocalTime timeStamp;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	@JsonBackReference(value = "user-bids")
	private User buyer;

	@ManyToOne
	@JoinColumn(name = "painting_id", nullable = false)
	@JsonBackReference(value = "painting-bids")
	private Painting painting;
}
