package at.fhtw.backend.model.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterUserDto {
    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9_]{3,20}$",
            message = "Username must be 3-20 characters and contain only letters, digits, or underscores")
    private String username;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
