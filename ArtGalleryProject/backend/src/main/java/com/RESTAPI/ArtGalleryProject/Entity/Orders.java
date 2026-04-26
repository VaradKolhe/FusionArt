package com.RESTAPI.ArtGalleryProject.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Orders")
public class Orders {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer orderId;
	
	@Column(name = "customer_name", length = 255)
	private String customerName;
	
	private double amount;
	
	@Column(length = 100)
	private String orderStatus;
	
	@Column(length = 255)
	private String razorpayId;
	
	@Column(length = 255)
	private String razorpayOrderId;
	
	@Column(length = 255)
	private String razorpayPaymentId;
	
	@Column(length = 255)
	private String email;
}