package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.RequestTourDto;
import at.fhtw.backend.model.dtos.ResponseTourDto;
import at.fhtw.backend.security.UserPrincipal;
import at.fhtw.backend.service.TourService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
public class TourController {

    private static final Logger log = LoggerFactory.getLogger(TourController.class);

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public List<ResponseTourDto> getAllTours(@AuthenticationPrincipal UserPrincipal principal) {
        log.debug("Listing tours for userId={}", principal.getId());
        return tourService.getAllToursByUserId(principal.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseTourDto createTour(@RequestBody @Valid RequestTourDto tourDto,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Creating tour title='{}' for userId={}", tourDto.getTitle(), principal.getId());
        return tourService.createTour(tourDto, principal.getId());
    }

    @PutMapping("/{tourId}")
    public ResponseTourDto updateTour(@PathVariable Long tourId,
                                      @RequestBody @Valid RequestTourDto requestTourDto,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Updating tourId={} for userId={}", tourId, principal.getId());
        return tourService.updateTour(tourId, requestTourDto, principal.getId());
    }

    @DeleteMapping("/{tourId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTour(@PathVariable Long tourId,
                           @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Deleting tourId={} for userId={}", tourId, principal.getId());
        tourService.deleteTour(tourId, principal.getId());
    }
}
