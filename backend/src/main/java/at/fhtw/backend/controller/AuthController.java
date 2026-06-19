package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.LoginUserDto;
import at.fhtw.backend.model.dtos.RegisterUserDto;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.UserRepository;
import at.fhtw.backend.service.JwtService;
import at.fhtw.backend.service.TourUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    JwtService jwtService;

    @Autowired
    TourUserDetailsService userDetailsService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //TODO: Handle what happens if user already exists
    @PostMapping("/register")
    public String register(@RequestBody @Valid RegisterUserDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);
        return jwtService.generateToken(user.getUsername());
    }

    @PostMapping("/login")
    public String login(@RequestBody @Valid LoginUserDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        return jwtService.generateToken(dto.getUsername());
    }
}
