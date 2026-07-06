package at.fhtw.backend.service;

import at.fhtw.backend.exception.UsernameAlreadyExistsException;
import at.fhtw.backend.model.dtos.LoginUserDto;
import at.fhtw.backend.model.dtos.RegisterUserDto;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthenticationManager authenticationManager;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authenticationManager = mock(AuthenticationManager.class);
        authService = new AuthService(userRepository, passwordEncoder, jwtService, authenticationManager);
    }

    private RegisterUserDto registerDto(String username) {
        RegisterUserDto dto = new RegisterUserDto();
        dto.setUsername(username);
        dto.setPassword("password123");
        return dto;
    }

    private LoginUserDto loginDto(String username) {
        LoginUserDto dto = new LoginUserDto();
        dto.setUsername(username);
        dto.setPassword("password123");
        return dto;
    }

    @Test
    void registerThrowsWhenUsernameAlreadyExists() {
        when(userRepository.findByUsername("taken")).thenReturn(Optional.of(new User()));

        assertThrows(UsernameAlreadyExistsException.class,
                () -> authService.register(registerDto("taken")));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerEncodesPasswordAndSavesUser() {
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(jwtService.generateToken("newuser")).thenReturn("jwt-token");

        String token = authService.register(registerDto("newuser"));

        assertEquals("jwt-token", token);
        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());
        assertEquals("newuser", savedUser.getValue().getUsername());
        assertEquals("encoded-password", savedUser.getValue().getPassword());
    }

    @Test
    void loginAuthenticatesAndReturnsToken() {
        when(jwtService.generateToken("testuser")).thenReturn("jwt-token");

        String token = authService.login(loginDto("testuser"));

        assertEquals("jwt-token", token);
        verify(authenticationManager).authenticate(any(Authentication.class));
    }

    @Test
    void loginFailsWithWrongCredentials() {
        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginDto("testuser")));
        verify(jwtService, never()).generateToken(anyString());
    }
}
