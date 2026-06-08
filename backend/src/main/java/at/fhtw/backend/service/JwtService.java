package at.fhtw.backend.service;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;

import java.util.Date;

@Service
public class JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

   @Value("${security.jwt.expiration-time}")
   private long expirationTime;

    public String generateToken(String username) {
        return JWT.create()
                .withClaim("username", username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
                .sign(Algorithm.HMAC256(secretKey));
    }

    public String extractUsername(String token) {
        return JWT.decode(token).getClaim("username").asString();
    }


    //Check if token is issued by us and if the token is not expired
    public boolean validateToken(String token) {
       try {
           DecodedJWT validatedToken = JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token);
           return validatedToken.getExpiresAt().getTime() > System.currentTimeMillis();
       } catch (JWTVerificationException e) {
           return false;
       }
    }
}
