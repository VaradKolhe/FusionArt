package com.RESTAPI.ArtGalleryProject.service.Auction;

import java.util.List;

import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.TopBidDTO;
import com.lowagie.text.DocumentException;

import io.jsonwebtoken.io.IOException;
import jakarta.mail.MessagingException;

public interface BidService {
    public void placeBid(long userId, long paintingId, double amount);
    public List<TopBidDTO> getTop3BidsWithRank(Long paintingId);
    public String auctionEnds() throws IOException, DocumentException, java.io.IOException, MessagingException;
    public String auctionStarts();
}
