package com.RESTAPI.ArtGalleryProject.service.OrderService;

import jakarta.mail.MessagingException;

public interface EmailService {
	public void sendOrderConfirmationEmailCOD(String to, String subject, String htmlContent, String inlineImageAbsolutePath, byte[] pdfBytes, String attachmentFilename) throws MessagingException;
	public void sendOrderConfirmationEmail(String to, String subject, String htmlContent) throws MessagingException;
	public void sendSimpleHtmlEmail(String to, String subject, String htmlContent) throws MessagingException;
}
