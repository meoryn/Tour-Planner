package at.fhtw.backend.exception;

public class TourNotFoundException extends RuntimeException {
    public TourNotFoundException(Long tourId) {
        super("Tour " + tourId + " not found");
    }
}