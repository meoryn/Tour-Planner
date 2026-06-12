package at.fhtw.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TourController {

    @GetMapping("/tour")
    public String getTour() {
        return "Tour";
    }
}
