package com.RESTAPI.ArtGalleryProject.Embeddable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Embeddable
public class Address {
	private String building;
	private String landmark;
	private String street;
	private String city;
	private String region;
	private String country;
	private String pincode;
	@Override
	public String toString() {
		return building + ", " + landmark + ", " + street + ", " + city + ", " + region + ", " + country + ". Pincode - " + pincode;
	}
}
