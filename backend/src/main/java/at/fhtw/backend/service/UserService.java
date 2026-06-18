package at.fhtw.backend.service;

import at.fhtw.backend.exception.UserNotFoundException;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserReference(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        return userRepository.getReferenceById(id);
    }
}
