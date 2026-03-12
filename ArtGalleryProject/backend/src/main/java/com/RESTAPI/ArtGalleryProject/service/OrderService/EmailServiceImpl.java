package com.RESTAPI.ArtGalleryProject.service.OrderService;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

	@Autowired
	private JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String emailFrom;

	@Override
	@Async
	public void sendOrderConfirmationEmailCOD(String to, String subject, String htmlContent,
			String inlineImageAbsolutePath, byte[] pdfBytes, String attachmentFilename) throws MessagingException {
		logger.info("Preparing MIME email to: {}", to);
		MimeMessage message = mailSender.createMimeMessage();

		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		helper.setFrom(emailFrom);
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlContent, true);

		// Inline painting image
		File imageFile = new File(inlineImageAbsolutePath);
		if (imageFile.exists()) {
			FileSystemResource imageResource = new FileSystemResource(imageFile);
			helper.addInline("paintingImage", imageResource);
		} else {
			logger.warn("Inline image not found at path: {}", inlineImageAbsolutePath);
		}

		// Attach PDF
		helper.addAttachment(attachmentFilename, new ByteArrayResource(pdfBytes));
		mailSender.send(message);
		logger.info("Email with PDF attachment successfully sent to: {}", to);
	}

	@Override
	@Async
	public void sendOrderConfirmationEmail(String to, String subject, String htmlContent) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlContent, true);
		mailSender.send(message);
	}

	@Override
	@Async
	public void sendSimpleHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlContent, true);
		mailSender.send(message);
	}

}
