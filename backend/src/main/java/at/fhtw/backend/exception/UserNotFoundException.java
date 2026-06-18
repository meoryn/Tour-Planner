package at.fhtw.backend.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(long Id) {
        super("User with userId " + Id + " not found");
    }
}
