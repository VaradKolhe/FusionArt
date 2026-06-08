package com.RESTAPI.ArtGalleryProject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.RESTAPI.ArtGalleryProject.Entity.Transactions;
import com.RESTAPI.ArtGalleryProject.Entity.User;

public interface TransactionRepo extends JpaRepository<Transactions, Long>{
	List<Transactions> findByUserOrderByTimeStampDesc(User user);
}
