package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.TourDifficulty;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link at.fhtw.backend.model.entities.TourLog}
 */
@Value
public class RequestTourLogDto implements Serializable {
    @NotNull
    Long tourId;
    @NotNull
    String comment;
    @NotNull
    TourDifficulty difficulty;
    @NotNull
    Double totalDistance;
    @NotNull
    Double totalTime;
    @NotNull
    Integer rating;
}