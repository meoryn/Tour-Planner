package at.fhtw.backend.model.openrouteservice;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeocodeResponse(GeocodeFeature[] features) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeocodeFeature(GeocodeGeometry geometry, GeocodeProperties properties) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeocodeGeometry(String type, double[] coordinates) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeocodeProperties(String label) {
    }
}
