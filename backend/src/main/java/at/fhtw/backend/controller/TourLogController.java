package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.RequestTourLogDto;
import at.fhtw.backend.model.dtos.ResponseTourLogDto;
import at.fhtw.backend.security.UserPrincipal;
import at.fhtw.backend.service.TourLogService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tour-logs")
public class TourLogController {

    private static final Logger log = LoggerFactory.getLogger(TourLogController.class);

    private final TourLogService tourLogService;

    public TourLogController(TourLogService tourLogService) {
        ;
        this.tourLogService = tourLogService;
    }

    @GetMapping
    public List<ResponseTourLogDto> getAllByTourId(@RequestParam @Valid Long tourId) {

        log.debug("Listing tour logs for tourId={}", tourId);
        return tourLogService.getAllByTourId(tourId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseTourLogDto createTourLog(@RequestBody RequestTourLogDto dto, @AuthenticationPrincipal UserPrincipal principal) {

        log.info("Creating tour log for userId={} and tourId={}", principal.getId(), dto.getTourId());
        return tourLogService.save(dto, principal.getId());
    }

    @PutMapping("/{tourLogId}")
    public ResponseTourLogDto updateTourLog(@PathVariable Long tourLogId, @RequestBody RequestTourLogDto dto, @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Updating tour log with id={} for userId={}", tourLogId, principal.getId());
        return tourLogService.update(dto, tourLogId, principal.getId());
    }

    @DeleteMapping("/{tourLogId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTourLog(@PathVariable Long tourLogId, @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Deleting tour log with id={} for userId={}", tourLogId, principal.getId());
        tourLogService.delete(tourLogId, principal.getId());
    }
}
