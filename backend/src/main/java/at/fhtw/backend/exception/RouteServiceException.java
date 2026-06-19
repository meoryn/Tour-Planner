package at.fhtw.backend.exception;

public class RouteServiceException extends RuntimeException {
    public RouteServiceException(String message) {
        super(message);
    }

    public RouteServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
