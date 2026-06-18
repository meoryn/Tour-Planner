package at.fhtw.backend.service;

import at.fhtw.backend.model.dtos.DirectionDTO;
import at.fhtw.backend.model.entities.Direction;
import at.fhtw.backend.model.entities.TransportType;
import at.fhtw.backend.model.openrouteservice.DirectionResponse;
import at.fhtw.backend.model.openrouteservice.feature;
import at.fhtw.backend.model.openrouteservice.summary;

import at.fhtw.backend.utils.LocationUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OpenRouteService {

    private final RestClient restClient;

    public OpenRouteService(@Value("${openrouteservice.api-key}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openrouteservice.org/v2/directions")
                .defaultHeader("Authorization", apiKey)
                .build();
    }

    public Direction getDirections(DirectionDTO request) {
        String profile = toOrsProfile(request.getTransportType());

        DirectionResponse response = restClient.post()
                .uri("/{profile}/geojson", profile)
                .body(Map.of("coordinates", new double[][] {LocationUtils.getCoordinates(request.getFrom()), LocationUtils.getCoordinates(request.getTo()) }))
                .retrieve()
                .body(DirectionResponse.class);

        feature feature = response.features()[0];
        summary summary = feature.properties().summary();

        return new Direction(
                summary.distance(),
                summary.duration(),
                feature.geometry().coordinates());
    }

    private String toOrsProfile(TransportType transportType) {
        return switch (transportType) {
            case CAR -> "driving-car";
            case WALK -> "foot-walking";
            case CYCLE -> "cycling-regular";
        };
    }

}
