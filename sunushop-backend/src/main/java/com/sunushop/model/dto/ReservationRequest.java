package com.sunushop.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {

    @NotNull(message = "L ID de l article est obligatoire")
    private Long articleId;

    @NotNull(message = "L ID du client est obligatoire")
    private Long clientId;

    @NotNull(message = "La quantite est obligatoire")
    private Integer quantity;

    @NotNull(message = "Le code entrepot est obligatoire")
    private String warehouseCode;
}