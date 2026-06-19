package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.TourDifficulty;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link at.fhtw.backend.model.entities.TourLog}
 */
@Value
public class ResponseTourLogDto implements Serializable {
    Long id;
    LocalDateTime creationDate;
    String comment;
    TourDifficulty difficulty;
    Double totalDistance;
    Double totalTime;
    Integer rating;
}