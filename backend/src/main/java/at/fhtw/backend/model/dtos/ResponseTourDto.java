package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.model.entities.TransportType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link at.fhtw.backend.model.entities.Tour}
 */
@Value
public class ResponseTourDto implements Serializable {

    @NotNull
    Long id;

    @NotNull
    String title;

    @NotNull
    String description;

    @NotNull
    TransportType transportType;

    @NotNull
    Location from;

    @NotNull
    Location to;

    @NotNull
    @Positive
    Double totalDistance;

    @NotNull
    @Positive
    Double totalDuration;
}