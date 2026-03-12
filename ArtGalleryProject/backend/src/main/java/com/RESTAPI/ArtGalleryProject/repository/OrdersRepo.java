package com.RESTAPI.ArtGalleryProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.RESTAPI.ArtGalleryProject.Entity.Orders;


public interface OrdersRepo extends JpaRepository<Orders, Integer>{

	Orders findByRazorpayOrderId(String razorpayId);

}