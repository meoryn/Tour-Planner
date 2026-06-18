package at.fhtw.backend.persistence;

import at.fhtw.backend.model.entities.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findAllByUserId(Long userId);

    Optional<Tour> findByIdAndUserId(Long id, Long userId);
}
