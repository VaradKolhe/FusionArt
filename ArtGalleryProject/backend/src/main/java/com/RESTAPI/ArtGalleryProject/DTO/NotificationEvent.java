package com.RESTAPI.ArtGalleryProject.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String type; // e.g., "ORDER_CONFIRMATION", "PAYMENT_SUCCESS"
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private Map<String, Object> data;
}
