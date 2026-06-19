package at.fhtw.backend.service;

import at.fhtw.backend.exception.TourLogNotFoundException;
import at.fhtw.backend.exception.TourLogOperationsNotAllowedException;
import at.fhtw.backend.model.dtos.RequestTourLogDto;
import at.fhtw.backend.model.dtos.ResponseTourLogDto;
import at.fhtw.backend.model.entities.Tour;
import at.fhtw.backend.model.entities.TourLog;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.TourLogRepository;
import at.fhtw.backend.utils.TourUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TourLogService {
    private static final Logger log = LoggerFactory.getLogger(TourLogService.class);

    private final TourLogRepository tourLogRepository;
    private final TourService tourService;
    private final UserService userService;

    public TourLogService(TourLogRepository tourLogRepository, TourService tourService, UserService userService) {
        this.tourLogRepository = tourLogRepository;
        this.tourService = tourService;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ResponseTourLogDto> getAllByTourId(Long tourId) {
        return tourLogRepository.findAllByTourId(tourId).stream()
                .map(TourUtils::toDtoFromTourLog)
                .toList();
    }

    @Transactional
    public ResponseTourLogDto save(RequestTourLogDto tourLog, long userId) {
        log.debug("Saving tour log: {}", tourLog);

        Tour targetTour = tourService.getTourById(tourLog.getTourId());
        User user = userService.getUserReference(userId);

        return TourUtils.toDtoFromTourLog(tourLogRepository.save(TourUtils.createTourLogFromDto(tourLog, targetTour, user)));
    }

    @Transactional
    public ResponseTourLogDto update(RequestTourLogDto tourLog, long tourLogId, long userId) {
        log.debug("Updating tour log with id: {}", tourLogId);

        TourLog targetTourLog = tourLogRepository.findById(tourLogId).orElseThrow(() -> new TourLogNotFoundException("Could not find tour log with id: " + tourLogId));

        if(targetTourLog.getUser().getId() != userId) {
            throw new TourLogOperationsNotAllowedException("User " + userId + " is not allowed to modify tour log " + tourLogId);
        }

        TourUtils.applyDtoToTourLog(targetTourLog, tourLog);

        return TourUtils.toDtoFromTourLog(targetTourLog);
    }

    @Transactional
    public void delete(Long tourLogId, long userId) {
        log.debug("Deleting tour log with id: {}", tourLogId);

        TourLog targetTourLog = tourLogRepository.findById(tourLogId).orElseThrow(() -> new TourLogNotFoundException("Could not find tour log with id: " + tourLogId));

        if(targetTourLog.getUser().getId() != userId) {
            throw new TourLogOperationsNotAllowedException("User " + userId + " is not allowed to modify tour log " + tourLogId);
        }

        tourLogRepository.deleteById(tourLogId);
    }
}
