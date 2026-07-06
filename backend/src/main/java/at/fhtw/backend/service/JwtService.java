package at.fhtw.backend.service;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;

import java.util.Date;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long expirationTime;

    public String generateToken(String username) {
        String token = JWT.create()
                .withClaim("username", username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
                .sign(Algorithm.HMAC256(secretKey));
        log.debug("Issued JWT for username='{}' (expires in {} ms)", username, expirationTime);
        return token;
    }

    public String extractUsername(String token) {
        return JWT.decode(token).getClaim("username").asString();
    }

    public boolean validateToken(String token) {
        try {
            DecodedJWT validatedToken = JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token);
            return validatedToken.getExpiresAt().getTime() > System.currentTimeMillis();
        } catch (JWTVerificationException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }
}
