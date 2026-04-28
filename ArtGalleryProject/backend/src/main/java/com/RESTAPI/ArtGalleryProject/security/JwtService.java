package com.RESTAPI.ArtGalleryProject.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.RESTAPI.ArtGalleryProject.Enum.Role;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

	@Value("${app.jwt.secret:23ui42ydq78cebqnspduq8o2h47ybr807G@*&G)&*TBD87qdb87gw7gw7dxhsefgbouydewgfyeb8723brf87gv2bdy8eg3w2g6}")
	private String SECRET_KEY;
	
	private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
	}
	
	public String generateToken(String email, long userId, Role role) {
		Map<String, Object> claims = new HashMap<>();
	    claims.put("email", email);
	    claims.put("userId", userId);
	    claims.put("role", role);
	    return Jwts.builder()
	            .claims(claims)
	            .issuedAt(new Date(System.currentTimeMillis()))
	            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
	            .signWith(getSigningKey(), Jwts.SIG.HS256)
	            .compact();
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parser()
			    .verifyWith(getSigningKey())
			    .build()
			    .parseSignedClaims(token)
			    .getPayload();
	}
}