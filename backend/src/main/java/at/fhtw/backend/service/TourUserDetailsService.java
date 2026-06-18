package at.fhtw.backend.service;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.security.UserPrincipal;
import org.springframework.security.core.userdetails.*;
import at.fhtw.backend.persistence.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
public class TourUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public TourUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword());
    }
}
