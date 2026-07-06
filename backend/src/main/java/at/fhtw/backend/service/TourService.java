package at.fhtw.backend.service;

import at.fhtw.backend.exception.TourNotFoundException;
import at.fhtw.backend.exception.TourOperationsNotAllowedException;
import at.fhtw.backend.model.dtos.RequestTourDto;
import at.fhtw.backend.model.dtos.ResponseTourDto;
import at.fhtw.backend.model.entities.Tour;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.TourRepository;
import at.fhtw.backend.utils.TourUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TourService {

    private static final Logger log = LoggerFactory.getLogger(TourService.class);

    private final TourRepository tourRepository;
    private final UserService userService;

    public TourService(TourRepository tourRepository, UserService userService) {
        this.tourRepository = tourRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ResponseTourDto> getAllToursByUserId(long userId) {
        List<ResponseTourDto> tours = tourRepository.findAllByUserId(userId).stream()
                .map(TourUtils::toDtoFromTour)
                .toList();
        log.debug("Found {} tours for userId={}", tours.size(), userId);
        return tours;
    }

    @Transactional(readOnly = true)
    public Tour getTourById(Long tourId) {
        return tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));
    }

    @Transactional
    public ResponseTourDto createTour(RequestTourDto tourDto, long userId) {
        User user = userService.getUserReference(userId);
        Tour saved = tourRepository.save(TourUtils.createTourFromDto(tourDto, user));
        log.info("Created tourId={} for userId={}", saved.getId(), userId);
        return TourUtils.toDtoFromTour(saved);
    }

    @Transactional
    public ResponseTourDto updateTour(Long tourId, RequestTourDto requestTourDto, long userId) {
        Tour tour = loadOwnedTour(tourId, userId);
        TourUtils.applyDtoToTour(tour, requestTourDto);
        log.info("Updated tourId={} for userId={}", tourId, userId);
        return TourUtils.toDtoFromTour(tour);
    }

    @Transactional
    public void deleteTour(Long tourId, long userId) {
        Tour tour = loadOwnedTour(tourId, userId);
        tourRepository.delete(tour);
        log.info("Deleted tourId={} for userId={}", tourId, userId);
    }

    private Tour loadOwnedTour(Long tourId, long userId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));
        if (!tour.getUser().getId().equals(userId)) {
            throw new TourOperationsNotAllowedException(
                    "User " + userId + " is not allowed to modify tour " + tourId);
        }
        return tour;
    }
}
