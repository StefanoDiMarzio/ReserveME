package com.reserveme.service;

import com.reserveme.dto.external.GeocodingApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeocodingService {

    private final RestClient googleMapsRestClient;

    @Value("${google.maps.api-key:}")
    private String apiKey;

    public record Coordinate(BigDecimal lat, BigDecimal lng) {
    }

    public Optional<Coordinate> geocodeIndirizzo(String indirizzo, String citta, String cap) {
        String query = Stream.of(indirizzo, citta, cap)
                .filter(s -> s != null && !s.isBlank())
                .reduce((a, b) -> a + ", " + b)
                .orElse("");

        if (query.isBlank() || apiKey == null || apiKey.isBlank()) {
            return Optional.empty();
        }

        try {
            GeocodingApiResponse response = googleMapsRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/maps/api/geocode/json")
                            .queryParam("address", query)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .body(GeocodingApiResponse.class);

            if (response == null || !"OK".equals(response.getStatus())
                    || response.getResults() == null || response.getResults().isEmpty()) {
                return Optional.empty();
            }

            GeocodingApiResponse.Location location = response.getResults().get(0).getGeometry().getLocation();
            return Optional.of(new Coordinate(location.getLat(), location.getLng()));
        } catch (Exception e) {
            log.warn("Geocoding fallito per indirizzo '{}': {}", query, e.getMessage());
            return Optional.empty();
        }
    }
}
