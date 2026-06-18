package at.fhtw.backend.service;

import at.fhtw.backend.exception.TourNotFoundException;
import at.fhtw.backend.exception.TourOperationsNotAllowedException;
import at.fhtw.backend.model.dtos.RequestTourDto;
import at.fhtw.backend.model.dtos.ResponseTourDto;
import at.fhtw.backend.model.entities.Tour;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.TourRepository;
import at.fhtw.backend.utils.TourUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TourService {

    private final TourRepository tourRepository;
    private final UserService userService;

    public TourService(TourRepository tourRepository, UserService userService) {
        this.tourRepository = tourRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ResponseTourDto> getAllToursByUserId(long userId) {
        return tourRepository.findAllByUserId(userId).stream()
                .map(TourUtils::toDtoFromTour)
                .toList();
    }

    @Transactional
    public ResponseTourDto createTour(RequestTourDto tourDto, long userId) {
        User user = userService.getUserReference(userId);
        return TourUtils.toDtoFromTour(tourRepository.save(TourUtils.createTourFromDto(tourDto, user)));
    }

    @Transactional
    public ResponseTourDto updateTour(Long tourId, RequestTourDto requestTourDto, long userId) {
        Tour tour = loadOwnedTour(tourId, userId);
        TourUtils.applyDtoToTour(tour, requestTourDto);
        return TourUtils.toDtoFromTour(tour);
    }

    @Transactional
    public void deleteTour(Long tourId, long userId) {
        Tour tour = loadOwnedTour(tourId, userId);
        tourRepository.delete(tour);
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
