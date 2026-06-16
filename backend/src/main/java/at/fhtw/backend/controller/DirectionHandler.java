package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.DirectionDTO;
import at.fhtw.backend.model.entities.Direction;
import at.fhtw.backend.service.OpenRouteService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/directions")
public class DirectionHandler {

    private final OpenRouteService openRouteService;

    public DirectionHandler(OpenRouteService openRouteService) {
        this.openRouteService = openRouteService;
    }

    @PostMapping
    public Direction getDirections(@RequestBody DirectionDTO request) {
        return openRouteService.getDirections(request);
    }
}
