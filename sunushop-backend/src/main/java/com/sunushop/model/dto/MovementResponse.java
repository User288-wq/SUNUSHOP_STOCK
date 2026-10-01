package com.sunushop.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovementResponse {
    private Long movementId;
    private Long articleId;
    private String warehouseCode;
    private Integer quantity;
    private String movementType;
    private Integer stockPhysical;
    private Integer stockReserved;
    private Integer stockAvailable;
    private LocalDateTime timestamp;
    private String message;
}
