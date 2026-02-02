package com.RESTAPI.ArtGalleryProject.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import com.RESTAPI.ArtGalleryProject.Enum.Role;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

	private final String SECRET_KEY = "23ui42ydq78cebqnspduq8o2h47ybr807G@*&G)&*TBD87qdb87gw7gw7dxhsefgbouydewgfyeb8723brf87gv2bdy8eg3w2g6";
	private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

	private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
	
	public String generateToken(String email, long userId, Role role) {
		Map<String, Object> claims = new HashMap<>();
	    claims.put("email", email);
	    claims.put("userId", userId);
	    claims.put("role", role);
	    return Jwts.builder()
	            .claims(claims)
	            .issuedAt(new Date(System.currentTimeMillis()))
	            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
	            .signWith(key, Jwts.SIG.HS256)
	            .compact();
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parser()
			    .verifyWith(key)
			    .build()
			    .parseSignedClaims(token)
			    .getPayload();
	}
}