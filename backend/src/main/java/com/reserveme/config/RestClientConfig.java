package com.reserveme.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient googleMapsRestClient(RestClient.Builder builder) {
        return builder
                .baseUrl("https://maps.googleapis.com")
                .build();
    }
}
