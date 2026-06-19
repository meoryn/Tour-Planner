package at.fhtw.backend.controller;

import at.fhtw.backend.model.dtos.DirectionDTO;
import at.fhtw.backend.model.entities.Direction;
import at.fhtw.backend.service.OpenRouteService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/directions")
public class DirectionHandler {

    private static final Logger log = LoggerFactory.getLogger(DirectionHandler.class);

    private final OpenRouteService openRouteService;

    public DirectionHandler(OpenRouteService openRouteService) {
        this.openRouteService = openRouteService;
    }

    @PostMapping
    public Direction getDirections(@RequestBody @Valid DirectionDTO request) {
        log.debug("Received direction request: {} -> {} ({})",
                request.getFrom().getLabel(), request.getTo().getLabel(), request.getTransportType());
        return openRouteService.getDirections(request);
    }
}
