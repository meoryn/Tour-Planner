package at.fhtw.backend.model.dtos;

import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.model.entities.TransportType;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link at.fhtw.backend.model.entities.Tour}
 */
@Value
public class ResponseTourDto implements Serializable {

    Long id;

    String title;

    String description;

    TransportType transportType;

    Location from;

    Location to;

    Double totalDistance;

    Double totalDuration;
}