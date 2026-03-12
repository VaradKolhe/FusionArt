package com.RESTAPI.ArtGalleryProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.RESTAPI.ArtGalleryProject.Entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
}


