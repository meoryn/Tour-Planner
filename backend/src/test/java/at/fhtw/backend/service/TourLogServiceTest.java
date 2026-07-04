package at.fhtw.backend.service;

import at.fhtw.backend.exception.TourLogNotFoundException;
import at.fhtw.backend.exception.TourLogOperationsNotAllowedException;
import at.fhtw.backend.model.dtos.RequestTourLogDto;
import at.fhtw.backend.model.dtos.ResponseTourLogDto;
import at.fhtw.backend.model.entities.Tour;
import at.fhtw.backend.model.entities.TourDifficulty;
import at.fhtw.backend.model.entities.TourLog;
import at.fhtw.backend.model.entities.User;
import at.fhtw.backend.persistence.TourLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TourLogServiceTest {

    private TourLogRepository tourLogRepository;
    private TourService tourService;
    private UserService userService;
    private TourLogService tourLogService;

    @BeforeEach
    void setUp() {
        tourLogRepository = mock(TourLogRepository.class);
        tourService = mock(TourService.class);
        userService = mock(UserService.class);
        tourLogService = new TourLogService(tourLogRepository, tourService, userService);
    }

    private TourLog testTourLog(long logId, long ownerId) {
        User owner = new User();
        owner.setId(ownerId);

        TourLog tourLog = new TourLog();
        tourLog.setId(logId);
        tourLog.setUser(owner);
        tourLog.setComment("comment");
        tourLog.setDifficulty(TourDifficulty.EASY);
        tourLog.setTotalDistance(5.0);
        tourLog.setTotalTime(30.0);
        tourLog.setRating(4);
        return tourLog;
    }

    private RequestTourLogDto testDto(long tourId, String comment) {
        return new RequestTourLogDto(tourId, comment, TourDifficulty.MEDIUM, 8.0, 45.0, 5);
    }

    @Test
    void getAllByTourIdMapsEntitiesToDtos() {
        when(tourLogRepository.findAllByTourId(1L))
                .thenReturn(List.of(testTourLog(1L, 1L), testTourLog(2L, 1L)));

        List<ResponseTourLogDto> result = tourLogService.getAllByTourId(1L);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
    }

    @Test
    void saveCreatesLogForTourAndUser() {
        Tour tour = new Tour();
        tour.setId(1L);
        User user = new User();
        user.setId(1L);
        when(tourService.getTourById(1L)).thenReturn(tour);
        when(userService.getUserReference(1L)).thenReturn(user);
        when(tourLogRepository.save(any(TourLog.class))).thenAnswer(toSave -> {
            TourLog logSave = toSave.getArgument(0);
            logSave.setId(99L);
            return logSave;
        });

        ResponseTourLogDto result = tourLogService.save(testDto(1L, "new log"), 1L);

        assertEquals(99L, result.getId());
        assertEquals("new log", result.getComment());
        verify(tourLogRepository).save(any(TourLog.class));
    }

    @Test
    void updateAppliesChangesWhenUserIsOwner() {
        TourLog tourLog = testTourLog(5L, 1L);
        when(tourLogRepository.findById(5L)).thenReturn(Optional.of(tourLog));

        ResponseTourLogDto result = tourLogService.update(testDto(1L, "updated"), 5L, 1L);

        assertEquals("updated", result.getComment());
        assertEquals("updated", tourLog.getComment());
        assertEquals(TourDifficulty.MEDIUM, tourLog.getDifficulty());
    }

    @Test
    void updateFailsWhenUserIsNotOwner() {
        TourLog tourLog = testTourLog(5L, 1L);
        when(tourLogRepository.findById(5L)).thenReturn(Optional.of(tourLog));

        assertThrows(TourLogOperationsNotAllowedException.class,
                () -> tourLogService.update(testDto(1L, "updated"), 5L, 2L));

        assertEquals("comment", tourLog.getComment());
    }

    @Test
    void updateThrowsWhenLogMissing() {
        when(tourLogRepository.findById(9L)).thenReturn(Optional.empty());

        assertThrows(TourLogNotFoundException.class,
                () -> tourLogService.update(testDto(1L, "x"), 9L, 1L));
    }

    @Test
    void deleteDeletesWhenUserIsOwner() {
        TourLog tourLog = testTourLog(5L, 1L);
        when(tourLogRepository.findById(5L)).thenReturn(Optional.of(tourLog));

        tourLogService.delete(5L, 1L);

        verify(tourLogRepository).deleteById(5L);
    }

    @Test
    void deleteThrowsWhenUserIsNotOwner() {
        TourLog tourLog = testTourLog(5L, 2L);
        when(tourLogRepository.findById(5L)).thenReturn(Optional.of(tourLog));

        assertThrows(TourLogOperationsNotAllowedException.class,
                () -> tourLogService.delete(5L, 1L));
        verify(tourLogRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteThrowsWhenLogMissing() {
        when(tourLogRepository.findById(9L)).thenReturn(Optional.empty());

        assertThrows(TourLogNotFoundException.class, () -> tourLogService.delete(9L, 1L));
    }
}
