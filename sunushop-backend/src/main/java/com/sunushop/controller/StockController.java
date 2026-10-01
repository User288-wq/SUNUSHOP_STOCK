package com.sunushop.controller;

import com.sunushop.model.dto.MovementRequest;
import com.sunushop.model.dto.MovementResponse;
import com.sunushop.model.entity.StockMovement;
import com.sunushop.service.stock.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v2/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockMovementService stockMovementService;

    @PostMapping("/movements")
    public ResponseEntity<MovementResponse> recordMovement(
            @Valid @RequestBody MovementRequest request) {
        MovementResponse response = stockMovementService.recordMovement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/articles/{articleId}/movements")
    public ResponseEntity<List<StockMovement>> getMovementsByArticle(
            @PathVariable Long articleId) {
        return ResponseEntity.ok(stockMovementService.getMovementsByArticle(articleId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("SunuShop Stock API operationnelle");
    }
}