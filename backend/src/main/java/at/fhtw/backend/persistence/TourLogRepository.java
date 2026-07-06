package at.fhtw.backend.persistence;

import at.fhtw.backend.model.entities.TourLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourLogRepository extends JpaRepository<TourLog, Long> {
    List<TourLog> findAllByTourId(Long tourId);
}
