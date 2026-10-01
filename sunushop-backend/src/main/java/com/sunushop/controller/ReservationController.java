package com.sunushop.controller;

import com.sunushop.model.dto.ReservationRequest;
import com.sunushop.model.entity.Reservation;
import com.sunushop.service.stock.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v2/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @Valid @RequestBody ReservationRequest request) {
        Reservation reservation = reservationService.createReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Reservation>> getActiveReservations() {
        return ResponseEntity.ok(reservationService.getActiveReservations());
    }

    @GetMapping("/articles/{articleId}/reserved-quantity")
    public ResponseEntity<Integer> getReservedQuantity(@PathVariable Long articleId) {
        return ResponseEntity.ok(reservationService.getActiveReservedQuantity(articleId));
    }
}