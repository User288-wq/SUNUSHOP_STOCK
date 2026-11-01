package com.sunushop.controller;

import com.sunushop.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v2/email")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @PostMapping("/test-low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> testLowStock() {
        emailService.checkLowStockAndNotify();
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "message", "Alerte stock bas declenchee. Verifie Mailtrap."
        ));
    }

    @PostMapping("/test-reservations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> testReservations() {
        emailService.checkReservationsExpiringSoon();
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "message", "Rappels reservation declenches. Verifie Mailtrap."
        ));
    }
}