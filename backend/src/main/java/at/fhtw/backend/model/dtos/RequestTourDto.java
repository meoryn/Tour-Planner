package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.model.entities.TransportType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link at.fhtw.backend.model.entities.Tour}
 */
@Value
public class RequestTourDto implements Serializable {

    @NotEmpty
    String title;

    @NotEmpty
    String description;

    @NotNull
    @Valid
    Location from;

    @NotNull
    @Valid
    Location to;

    @NotNull
    TransportType transportType;

    @NotNull
    @Positive
    Double totalDistance;

    @NotNull
    @Positive
    Double totalDuration;
}
