package at.fhtw.backend.utils;

import at.fhtw.backend.model.dtos.RequestTourDto;
import at.fhtw.backend.model.dtos.ResponseTourDto;
import at.fhtw.backend.model.entities.Tour;
import at.fhtw.backend.model.entities.User;

public class TourUtils {
    public static ResponseTourDto toDtoFromTour(Tour tour) {
        return new ResponseTourDto(
                tour.getId(),
                tour.getTitle(),
                tour.getDescription(),
                tour.getTransportType(),
                tour.getFrom(),
                tour.getTo(),
                tour.getTotalDistance(),
                tour.getTotalDuration()
        );
    }

    public static void applyDtoToTour(Tour tour, RequestTourDto dto) {
        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setTransportType(dto.getTransportType());
        tour.setFrom(dto.getFrom());
        tour.setTo(dto.getTo());
        tour.setTotalDistance(dto.getTotalDistance());
        tour.setTotalDuration(dto.getTotalDuration());
    }

    public static Tour createTourFromDto(RequestTourDto dto, User user) {
        Tour tour = new Tour();
        tour.setUser(user);
        applyDtoToTour(tour, dto);
        return tour;
    }
}
