package at.fhtw.backend.exception;

public class TourOperationsNotAllowedException extends RuntimeException {
    public TourOperationsNotAllowedException(String message) {
        super(message);
    }
}
