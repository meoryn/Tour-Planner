package at.fhtw.backend.utils;

import at.fhtw.backend.model.entities.Location;

public class LocationUtils {
    public static double[] getCoordinates(Location location) {
        return new double[] {location.getLng(), location.getLat()};
    }
}
