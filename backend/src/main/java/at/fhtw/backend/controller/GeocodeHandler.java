package at.fhtw.backend.controller;

import at.fhtw.backend.model.entities.Location;
import at.fhtw.backend.service.OpenRouteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/geocode")
public class GeocodeHandler {

    private static final Logger log = LoggerFactory.getLogger(GeocodeHandler.class);

    private final OpenRouteService openRouteService;

    public GeocodeHandler(OpenRouteService openRouteService) {
        this.openRouteService = openRouteService;
    }

    @GetMapping
    public List<Location> geocode(@RequestParam String text) {
        log.debug("Received geocode request for text='{}'", text);
        return openRouteService.geocode(text);
    }
}
