package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.RequestTourDto;
import at.fhtw.backend.model.dtos.ResponseTourDto;
import at.fhtw.backend.security.UserPrincipal;
import at.fhtw.backend.service.TourService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public List<ResponseTourDto> getAllTours(@AuthenticationPrincipal UserPrincipal principal) {
        return tourService.getAllToursByUserId(principal.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseTourDto createTour(@RequestBody @Valid RequestTourDto tourDto,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        return tourService.createTour(tourDto, principal.getId());
    }

    @PutMapping("/{tourId}")
    public ResponseTourDto updateTour(@PathVariable Long tourId,
                                      @RequestBody @Valid RequestTourDto requestTourDto,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        return tourService.updateTour(tourId, requestTourDto, principal.getId());
    }

    @DeleteMapping("/{tourId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTour(@PathVariable Long tourId,
                           @AuthenticationPrincipal UserPrincipal principal) {
        tourService.deleteTour(tourId, principal.getId());
    }
}
