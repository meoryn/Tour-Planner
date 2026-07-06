package at.fhtw.backend.model.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportType transportType;

    // Add coordinates directly to the tour entry for now. Might be changed based on further development.
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "label", column = @Column(name = "from_label", nullable = false)),
            @AttributeOverride(name = "lat",   column = @Column(name = "from_lat",   nullable = false)),
            @AttributeOverride(name = "lng",   column = @Column(name = "from_lng",   nullable = false))
    })
    private Location from;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "label", column = @Column(name = "to_label", nullable = false)),
            @AttributeOverride(name = "lat",   column = @Column(name = "to_lat",   nullable = false)),
            @AttributeOverride(name = "lng",   column = @Column(name = "to_lng",   nullable = false))
    })
    private Location to;

    @Column(nullable = false)
    private Double totalDistance;

    @Column(nullable = false)
    private Double totalDuration;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<TourLog> logs = new ArrayList<>();

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}