package com.reserveme.controller;

import com.reserveme.dto.response.DashboardResponse;
import com.reserveme.dto.response.GenericResponse;
import com.reserveme.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/riepilogo")
    public ResponseEntity<GenericResponse<DashboardResponse>> getRiepilogo() {
        return ResponseEntity.ok(new GenericResponse<>(
                200,
                "Dati dashboard recuperati",
                dashboardService.getDashboardData(),
                LocalDateTime.now().toString()
        ));
    }
}
