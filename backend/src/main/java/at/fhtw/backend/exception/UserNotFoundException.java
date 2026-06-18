package at.fhtw.backend.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(long id) {
        super("User with userId " + id + " not found");
    }
}
