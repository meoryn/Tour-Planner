package at.fhtw.backend.utils;

import at.fhtw.backend.model.entities.Location;

public class LocationUtils {
    public static float[] getCoordinates(Location location) {
        return new float[] {location.getLng(), location.getLat()};
    }
}
