package com.RESTAPI.ArtGalleryProject.service.OrderService;

import java.util.List;

import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.Transactions;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.RESTAPI.ArtGalleryProject.Enum.TransactionType;

public interface TransactionService {
        public void createTransaction(User user, TransactionType type, double amount, Painting painting);
        public void createTransaction(User user, TransactionType type, double amount);
        public List<Transactions> getTransactionHistory(long userId);
}
