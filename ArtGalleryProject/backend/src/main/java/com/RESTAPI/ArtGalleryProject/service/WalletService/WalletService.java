package com.RESTAPI.ArtGalleryProject.service.WalletService;

import java.util.Map;

public interface WalletService {
	public Map<String, Object> getBalance(String email);
	public void incrementBalanceByEmail(String email, double amount);
	public void decrementBalanceByEmail(String email, double amount);
	public Map<String, Object> processWithdrawalRequest(long userId, String email, Map<String, Object> request);
}
