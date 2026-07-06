package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.LoginUserDto;
import at.fhtw.backend.model.dtos.RegisterUserDto;
import at.fhtw.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@RequestBody @Valid RegisterUserDto dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody @Valid LoginUserDto dto) {
        return authService.login(dto);
    }
}
