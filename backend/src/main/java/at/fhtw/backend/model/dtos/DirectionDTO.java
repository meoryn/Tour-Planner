package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.TransportType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DirectionDTO {

    @NotNull
    @Valid
    private Coordinates from;

    @NotNull
    @Valid
    private Coordinates to;

    @NotNull
    private TransportType transportType;
}
