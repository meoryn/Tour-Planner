package at.fhtw.backend.model.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterUserDto {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
