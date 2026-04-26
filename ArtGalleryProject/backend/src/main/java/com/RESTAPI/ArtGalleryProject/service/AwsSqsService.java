package com.RESTAPI.ArtGalleryProject.service;

import com.RESTAPI.ArtGalleryProject.DTO.NotificationEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@Service
public class AwsSqsService {

    private static final Logger logger = LoggerFactory.getLogger(AwsSqsService.class);

    @Autowired(required = false)
    private SqsClient sqsClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.sqs.notification-queue:}")
    private String queueUrl;

    public void publishNotification(NotificationEvent event) {
        if (queueUrl == null || queueUrl.isEmpty() || sqsClient == null) {
            logger.warn("SQS not configured. Skipping notification for: {}", event.getRecipientEmail());
            return;
        }

        try {
            String messageBody = objectMapper.writeValueAsString(event);
            SendMessageRequest request = SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(messageBody)
                    .build();

            sqsClient.sendMessage(request);
            logger.info("Published notification event to SQS: {}", event.getType());
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize notification event", e);
        } catch (Exception e) {
            logger.error("Failed to publish message to SQS", e);
        }
    }
}
