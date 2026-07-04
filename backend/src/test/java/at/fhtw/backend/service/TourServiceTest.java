package at.fhtw.backend.service;

import at.fhtw.backend.exception.TourNotFoundException;
import at.fhtw.backend.exception.TourOperationsNotAllowedException;
import at.fhtw.backend.model.dtos.RequestTourDto;
import at.fhtw.backend.model.dtos.ResponseTourDto;
import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.model.entities.Tour;
import at.fhtw.backend.model.entities.TransportType;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.TourRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TourServiceTest {

    private TourRepository tourRepository;
    private UserService userService;
    private TourService tourService;

    @BeforeEach
    void setUp() {
        tourRepository = mock(TourRepository.class);
        userService = mock(UserService.class);
        tourService = new TourService(tourRepository, userService);
    }

    private Tour testTour(long tourId, long ownerId) {
        User owner = new User();
        owner.setId(ownerId);

        Tour tour = new Tour();
        tour.setId(tourId);
        tour.setUser(owner);
        tour.setTitle("title");
        tour.setDescription("description");
        tour.setTransportType(TransportType.CAR);
        tour.setFrom(new Location("A", 1, 2));
        tour.setTo(new Location("B", 3, 4));
        tour.setTotalDistance(10.0);
        tour.setTotalDuration(20.0);
        return tour;
    }

    private RequestTourDto testDto(String title) {
        return new RequestTourDto(
                title,
                "desc",
                new Location("From", 48.0, 16.0),
                new Location("To", 47.0, 15.0),
                TransportType.WALK,
                5.0,
                10.0);
    }

    @Test
    void getAllToursByUserIdMapsEntitiesToDtos() {
        when(tourRepository.findAllByUserId(1L))
                .thenReturn(List.of(testTour(1L, 1L), testTour(2L, 1L)));

        List<ResponseTourDto> result = tourService.getAllToursByUserId(1L);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
    }

    @Test
    void getTourByIdReturnsTourWhenFound() {
        Tour tour = testTour(5L, 1L);
        when(tourRepository.findById(5L)).thenReturn(Optional.of(tour));

        assertSame(tour, tourService.getTourById(5L));
    }

    @Test
    void getTourByIdThrowsWhenMissing() {
        when(tourRepository.findById(9L)).thenReturn(Optional.empty());

        assertThrows(TourNotFoundException.class, () -> tourService.getTourById(9L));
    }

    @Test
    void createTourSavesTourForUserAndReturnsDto() {
        User user = new User();
        user.setId(1L);
        when(userService.getUserReference(1L)).thenReturn(user);
        when(tourRepository.save(any(Tour.class))).thenAnswer(toSave -> {
            Tour tourSave = toSave.getArgument(0);
            tourSave.setId(99L);
            return toSave;
        });

        ResponseTourDto result = tourService.createTour(testDto("New Tour"), 1L);

        assertEquals(99L, result.getId());
        assertEquals("New Tour", result.getTitle());
        verify(tourRepository).save(any(Tour.class));
    }

    @Test
    void updateTourAppliesChangesWhenUserIsOwner() {
        Tour tour = testTour(5L, 1L);
        when(tourRepository.findById(5L)).thenReturn(Optional.of(tour));

        ResponseTourDto result = tourService.updateTour(5L, testDto("Updated"), 1L);

        assertEquals("Updated", result.getTitle());
        assertEquals("Updated", tour.getTitle());
        assertEquals(TransportType.WALK, tour.getTransportType());
    }

    @Test
    void updateTourFailsWhenUserIsNotOwner() {
        Tour tour = testTour(5L, 1L);
        tour.setTitle("Title");
        when(tourRepository.findById(5L)).thenReturn(Optional.of(tour));

        assertThrows(TourOperationsNotAllowedException.class,
                () -> tourService.updateTour(5L, testDto("Updated"), 2L));

        assertEquals("Title", tour.getTitle());
    }

    @Test
    void updateTourThrowsWhenTourMissing() {
        when(tourRepository.findById(5L)).thenReturn(Optional.empty());

        assertThrows(TourNotFoundException.class,
                () -> tourService.updateTour(5L, testDto("x"), 1L));
    }

    @Test
    void deleteTourDeletesWhenUserIsOwner() {
        Tour tour = testTour(5L, 1L);
        when(tourRepository.findById(5L)).thenReturn(Optional.of(tour));

        tourService.deleteTour(5L, 1L);

        verify(tourRepository).delete(tour);
    }

    @Test
    void deleteTourThrowsWhenUserIsNotOwner() {
        Tour tour = testTour(5L, 2L);
        when(tourRepository.findById(5L)).thenReturn(Optional.of(tour));

        assertThrows(TourOperationsNotAllowedException.class,
                () -> tourService.deleteTour(5L, 1L));
        verify(tourRepository, never()).delete(any(Tour.class));
    }

    @Test
    void deleteTourThrowsWhenTourMissing() {
        when(tourRepository.findById(5L)).thenReturn(Optional.empty());

        assertThrows(TourNotFoundException.class, () -> tourService.deleteTour(5L, 1L));
    }
}
