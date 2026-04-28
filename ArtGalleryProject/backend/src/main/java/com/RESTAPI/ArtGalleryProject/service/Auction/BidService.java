package com.RESTAPI.ArtGalleryProject.service.Auction;

import java.util.List;
import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.TopBidDTO;
import com.lowagie.text.DocumentException;
import jakarta.mail.MessagingException;
import java.io.IOException;

public interface BidService {
    void placeBid(long userId, long paintingId, double amount);
    List<TopBidDTO> getTop3BidsWithRank(Long paintingId);
    String auctionEnds() throws IOException, DocumentException, MessagingException;
    String auctionStarts();
    boolean isAnyAuctionLive();
}
