package at.fhtw.backend.service;

import at.fhtw.backend.exception.RouteServiceException;
import at.fhtw.backend.model.dtos.DirectionDTO;
import at.fhtw.backend.model.entities.Direction;
import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.model.entities.TransportType;
import at.fhtw.backend.model.openrouteservice.DirectionResponse;
import at.fhtw.backend.model.openrouteservice.GeocodeResponse;
import at.fhtw.backend.model.openrouteservice.feature;
import at.fhtw.backend.model.openrouteservice.summary;

import at.fhtw.backend.utils.LocationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class OpenRouteService {

    private static final Logger log = LoggerFactory.getLogger(OpenRouteService.class);

    private final RestClient restClient;

    @Autowired
    public OpenRouteService(@Value("${openrouteservice.api-key}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openrouteservice.org")
                .defaultHeader("Authorization", apiKey)
                .build();
    }

    OpenRouteService(RestClient restClient) {
        this.restClient = restClient;
    }

    public Direction getDirections(DirectionDTO request) {
        String profile = toOrsProfile(request.getTransportType());

        log.info("Requesting ORS directions: profile={} from={} to={}",
                profile, request.getFrom().getLabel(), request.getTo().getLabel());

        DirectionResponse response;
        try {
            response = restClient.post()
                    .uri("/v2/directions/{profile}/geojson", profile)
                    .body(Map.of("coordinates", new double[][]{
                            LocationUtils.getCoordinates(request.getFrom()),
                            LocationUtils.getCoordinates(request.getTo())
                    }))
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            (req, res) -> {
                                String body = readBody(res);
                                log.error("ORS request failed: status={} body={}", res.getStatusCode(), body);
                                throw new RouteServiceException(
                                        "OpenRouteService rejected the request (" + res.getStatusCode() + "): " + body);
                            })
                    .body(DirectionResponse.class);
        } catch (RouteServiceException e) {
            throw e;
        } catch (RestClientException e) {
            log.error("ORS request failed with transport error", e);
            throw new RouteServiceException("Could not reach OpenRouteService: " + e.getMessage(), e);
        }

        if (response == null || response.features() == null || response.features().length == 0) {
            log.error("ORS returned no features for profile={} from={} to={}",
                    profile, request.getFrom().getLabel(), request.getTo().getLabel());
            throw new RouteServiceException("OpenRouteService returned no route");
        }

        feature feature = response.features()[0];
        if (feature == null || feature.properties() == null || feature.properties().summary() == null
                || feature.geometry() == null || feature.geometry().coordinates() == null) {
            log.error("ORS returned malformed feature for profile={}", profile);
            throw new RouteServiceException("OpenRouteService returned a malformed route");
        }
        summary summary = feature.properties().summary();

        log.info("ORS directions ok: profile={} distance={}m duration={}s",
                profile, summary.distance(), summary.duration());

        return new Direction(
                summary.distance(),
                summary.duration(),
                feature.geometry().coordinates());
    }

    public List<Location> geocode(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        log.info("Requesting ORS geocoding for text='{}'", text);

        GeocodeResponse response;
        try {
            response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/geocode/search")
                            .queryParam("text", text)
                            .build())
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            (req, res) -> {
                                String body = readBody(res);
                                log.error("ORS geocoding failed: status={} body={}", res.getStatusCode(), body);
                                throw new RouteServiceException(
                                        "OpenRouteService rejected the geocoding request (" + res.getStatusCode() + "): " + body);
                            })
                    .body(GeocodeResponse.class);
        } catch (RouteServiceException e) {
            throw e;
        } catch (RestClientException e) {
            log.error("ORS geocoding failed with transport error", e);
            throw new RouteServiceException("Could not reach OpenRouteService: " + e.getMessage(), e);
        }

        if (response == null || response.features() == null) {
            return List.of();
        }

        return Arrays.stream(response.features())
                .filter(feature -> feature != null
                        && feature.geometry() != null
                        && "Point".equals(feature.geometry().type())
                        && feature.geometry().coordinates() != null
                        && feature.geometry().coordinates().length >= 2
                        && feature.properties() != null
                        && feature.properties().label() != null)
                .map(feature -> new Location(
                        feature.properties().label(),
                        feature.geometry().coordinates()[1],
                        feature.geometry().coordinates()[0]))
                .toList();
    }

    private String toOrsProfile(TransportType transportType) {
        return switch (transportType) {
            case CAR -> "driving-car";
            case WALK -> "foot-walking";
            case CYCLE -> "cycling-regular";
        };
    }

    private String readBody(org.springframework.http.client.ClientHttpResponse res) {
        try {
            return new String(res.getBody().readAllBytes());
        } catch (IOException e) {
            return "<unreadable>";
        }
    }
}
