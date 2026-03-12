package com.RESTAPI.ArtGalleryProject.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class LoginCredentials {
	
	@Id
	private String email;
	
	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "userId")
	private User user;
	
	private String password;
	private String securityQuestion;
	private String securityAnswer;
}
