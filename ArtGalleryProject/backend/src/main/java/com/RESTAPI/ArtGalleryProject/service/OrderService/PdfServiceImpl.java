package com.RESTAPI.ArtGalleryProject.service.OrderService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.RESTAPI.ArtGalleryProject.Entity.Orders;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.lowagie.text.DocumentException;


@Service
public class PdfServiceImpl implements PdfService{

	@Override
	@Async
    public CompletableFuture<byte[]> generateReceiptPdf(Orders order, User user, Painting painting, String imageDirectory, 
    		String paymentMode, String name, String contactNumber, String address)
            throws DocumentException, IOException {

        String formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
        Path imagePath = Paths.get(imageDirectory, painting.getImageUrl());
        String imageUri = imagePath.toUri().toString();

        String html = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body {
                        font-family: 'Helvetica Neue', 'Helvetica', sans-serif;
                        background-color: #ffffff;
                        color: #333;
                        padding: 40px;
                        font-size: 14px;
                    }
                    .container {
                        max-width: 700px;
                        margin: auto;
                        border: 1px solid #eee;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 0 8px rgba(0,0,0,0.05);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .header h1 {
                        font-size: 28px;
                        margin: 0;
                        color: #2c3e50;
                    }
                    .header p {
                        margin: 5px 0;
                        color: #888;
                    }
                    .info-table, .item-table {
                        width: 100%%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    .info-table td {
                        padding: 6px 0;
                    }
                    .item-table th, .item-table td {
                        border: 1px solid #eee;
                        padding: 12px;
                        text-align: center;
                    }
                    .item-table th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                    }
                    .item-img {
                        width: 150px;
                        border-radius: 8px;
                    }
                    .total {
                        margin-top: 30px;
                        text-align: right;
                        font-size: 16px;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Fusion Art</h1>
                        <p>Order Receipt</p>
                    </div>

                    <table class="info-table">
                        <tr>
                            <td><strong>Order ID:</strong> #%d</td>
                            <td><strong>Date:</strong> %s</td>
                        </tr>
                        <tr>
                            <td><strong>Billed To:</strong> %s</td>
                            <td><strong>Payment Mode:</strong> %s</td>
                        </tr>
                        <tr>
                            <td colspan="2"><strong>Address:</strong> %s</td>
                        </tr>
                        <tr>
        		            <td><strong>Contact Number:</strong> %s</td>
        		        </tr>
                    </table>

                    <table class="item-table">
                        <thead>
                            <tr>
                                <th>Painting</th>
                                <th>Title</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><img src="%s" class="item-img" alt="%s"/></td>
                                <td>%s</td>
                                <td>₹%.2f</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="total">Total: ₹%.2f</div>

                    <div class="footer">
                        &copy; %d Fusion Art. Thank you for shopping with us.
                    </div>
                </div>
            </body>
            </html>
        """.formatted(
            order.getOrderId(),
            formattedDate,
            name,
            paymentMode,
            address,
            contactNumber,
            imageUri,
            painting.getTitle(),
            painting.getTitle(),
            order.getAmount(),
            order.getAmount(),
            Year.now().getValue()
        );

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(outputStream);
            byte[] pdfBytes = outputStream.toByteArray();
            return CompletableFuture.completedFuture(pdfBytes);
        }
    }


	
}
