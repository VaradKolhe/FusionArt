package com.RESTAPI.ArtGalleryProject.service.DashBoard;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.RESTAPI.ArtGalleryProject.DTO.DashBoard.UserDetailsResponse;
import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.UserDetailRequest;
import com.RESTAPI.ArtGalleryProject.DTO.UploadPainting.PaintingResponse;
import com.RESTAPI.ArtGalleryProject.Entity.Painting;
import com.RESTAPI.ArtGalleryProject.Entity.User;
import com.RESTAPI.ArtGalleryProject.repository.UserRepo;

@Service
public class UserServiceImpl implements UserService{
	
	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
	
	@Autowired
    private UserRepo userRepo;

	@Override
	public Object getUserDetials(long userId, String email) {
		logger.info("getUserDetials started.");
		Optional<User> userOpt = userRepo.findById(userId);
		if(userOpt.isEmpty()) {
			return "User not found";
		}
		User user = userOpt.get();
		List<Painting> p1 = user.getPaintingsSold();
		List<Painting> p2 = user.getPaintingsBought();

		List<PaintingResponse> soldResponses = p1.stream().map(painting -> new PaintingResponse(
		        painting.getPaintingId(),
		        painting.getImageUrl(),
		        painting.getTitle(),
		        painting.getDescription(),
		        painting.getLength(),
		        painting.getBreadth(),
		        painting.getStartingPrice(),
		        painting.getFinalPrice(),
		        painting.isForAuction(),
		        painting.isSold(),
		        painting.getSeller().getName()
		)).toList();

		List<PaintingResponse> boughtResponses = p2.stream().map(painting -> new PaintingResponse(
		        painting.getPaintingId(),
		        painting.getImageUrl(),
		        painting.getTitle(),
		        painting.getDescription(),
		        painting.getLength(),
		        painting.getBreadth(),
		        painting.getStartingPrice(),
		        painting.getFinalPrice(),
		        painting.isForAuction(),
		        painting.isSold(),
		        painting.getSeller().getName()
		)).toList();

		UserDetailsResponse response = new UserDetailsResponse(
		        user.getAddress(),
		        user.getName(),
		        email,
		        user.getPhoneNumber(),
		        user.getCreatedAt(),
		        soldResponses,
		        boughtResponses
		);

		logger.info("getUserDetials finished.");
		return response;
	}

	@Override
	public String updateUserDetails(UserDetailRequest request, long userId) {
		logger.info("updateUserDetails started.");
		try {
			var user = userRepo.findById(userId).get();
			user.setAddress(request.address());
			user.setName(request.name());
			user.setPhoneNumber(request.phoneNumber());
			userRepo.save(user);
		} catch (Exception e) {
			e.printStackTrace();
			return "Internal error occurred";
		}
		logger.info("updateUserDetails finished.");
		return "User info updated";
	}
	
	
}
