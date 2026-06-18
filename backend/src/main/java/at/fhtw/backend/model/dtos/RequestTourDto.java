package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.model.entities.TransportType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link at.fhtw.backend.model.entities.Tour}
 */
@Value
public class RequestTourDto implements Serializable {

    @NotNull
    @NotEmpty
    String title;

    @NotNull
    @NotEmpty
    String description;

    @NotNull
    Location from;
    @NotNull
    Location to;

    @NotNull
    TransportType transportType;

    @NotNull
    Double totalDistance;

    @NotNull
    Double totalDuration;
}