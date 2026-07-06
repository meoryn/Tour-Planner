package at.fhtw.backend.exception;

public class TourLogOperationsNotAllowedException extends RuntimeException {
    public TourLogOperationsNotAllowedException(String message) {
        super(message);
    }
}
