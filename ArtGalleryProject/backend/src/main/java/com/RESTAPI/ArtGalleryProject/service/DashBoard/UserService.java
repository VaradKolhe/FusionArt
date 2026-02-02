package com.RESTAPI.ArtGalleryProject.service.DashBoard;

import com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup.UserDetailRequest;

public interface UserService {
	public Object getUserDetials(long userId, String email);
	public String updateUserDetails(UserDetailRequest request, long userId);
}
