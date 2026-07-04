package at.fhtw.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "test-secret-key");
        ReflectionTestUtils.setField(jwtService, "expirationTime", 3600000L);
    }

    @Test
    void generatedTokenIsValid() {
        String token = jwtService.generateToken("testuser");

        assertTrue(jwtService.validateToken(token));
    }

    @Test
    void extractUsernameReturnsUsernameClaim() {
        String token = jwtService.generateToken("testuser");

        assertEquals("testuser", jwtService.extractUsername(token));
    }

    @Test
    void validateTokenRejectsMalformedToken() {
        assertFalse(jwtService.validateToken("not.a.token"));
    }

    @Test
    void validateTokenRejectsExpiredToken() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", -1000L);
        String expiredToken = jwtService.generateToken("testuser");

        assertFalse(jwtService.validateToken(expiredToken));
    }

    @Test
    void validateTokenRejectsTokenSignedWithDifferentKey() {
        String token = jwtService.generateToken("testuser");
        ReflectionTestUtils.setField(jwtService, "secretKey", "another-secret-key");

        assertFalse(jwtService.validateToken(token));
    }
}
