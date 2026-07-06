package at.fhtw.backend.model.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Direction {

    private double totalDistance;  
    private double totalDuration;   
    private double[][] coordinates; 
}
