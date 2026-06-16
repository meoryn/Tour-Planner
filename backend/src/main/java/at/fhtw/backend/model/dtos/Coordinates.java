package at.fhtw.backend.model.dtos;

import jakarta.validation.constraints.NotNull;

public record Coordinates(@NotNull Float lat, @NotNull Float lng) {

    public float[] toLonLat() {
        return new float[] { lng, lat };
    }
}
