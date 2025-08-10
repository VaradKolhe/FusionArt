package com.RESTAPI.ArtGalleryProject.DTO.LoginANDsignup;

import com.RESTAPI.ArtGalleryProject.Embeddable.Address;

public record UserDetailRequest (
	String name,
	Address address,
	String phoneNumber
) {}
