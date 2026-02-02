package com.RESTAPI.ArtGalleryProject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RESTAPI.ArtGalleryProject.Entity.LoginCredentials;
import com.RESTAPI.ArtGalleryProject.Entity.User;

@Repository
public interface LoginCredRepo extends JpaRepository<LoginCredentials, String> {
	Optional<LoginCredentials> findByUser(User user);
}
