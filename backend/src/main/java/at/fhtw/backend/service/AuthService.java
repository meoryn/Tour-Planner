package at.fhtw.backend.service;

import at.fhtw.backend.exception.UsernameAlreadyExistsException;
import at.fhtw.backend.model.dtos.LoginUserDto;
import at.fhtw.backend.model.dtos.RegisterUserDto;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public String register(RegisterUserDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            log.warn("Registration rejected: username '{}' already exists", dto.getUsername());
            throw new UsernameAlreadyExistsException(dto.getUsername());
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);

        log.info("Registered new user '{}'", user.getUsername());
        return jwtService.generateToken(user.getUsername());
    }

    public String login(LoginUserDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );
        log.info("User '{}' logged in", dto.getUsername());
        return jwtService.generateToken(dto.getUsername());
    }
}
