package at.fhtw.backend.service;

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

    //TODO: Change to tourDTO
    @Transactional(readOnly = true)
    public List<Tour> getAllToursByUserId(long userId){
        return tourRepository.findAllByUserId(userId);
    }

    @Transactional
    public ResponseTourDto createTour(RequestTourDto tourDto, long userId){

        User user = userService.getUserReference(userId);

        return TourUtils.toDtoFromTour(tourRepository.save(TourUtils.createTourFromDto(tourDto, user)));
    }

    @Transactional
    public ResponseTourDto updateTour(Long tourId, RequestTourDto responseTourDto, long userId){

        Tour tour = tourRepository.findByIdAndUserId(tourId, userId)
                .orElseThrow(() -> new TourOperationsNotAllowedException("Tour not found or not allowed to update by user"));

        TourUtils.applyDtoToTour(tour, responseTourDto);

        return TourUtils.toDtoFromTour(tour);
    }

    @Transactional
    public boolean deleteTour(Long tourId, long userId){

        Tour tour = tourRepository.findByIdAndUserId(tourId, userId)
                .orElseThrow(() -> new TourOperationsNotAllowedException("Tour not found or not allowed to update by user"));

        tourRepository.delete(tour);

        return true;
    }
}
