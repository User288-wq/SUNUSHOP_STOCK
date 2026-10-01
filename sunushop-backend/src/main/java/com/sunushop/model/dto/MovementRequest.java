package com.sunushop.model.dto;

import com.sunushop.model.enums.MovementType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovementRequest {

    @NotNull(message = "L ID de l article est obligatoire")
    private Long articleId;

    @NotNull(message = "Le code entrepot est obligatoire")
    private String warehouseCode;

    @NotNull(message = "La quantite est obligatoire")
    private Integer quantity;

    @NotNull(message = "Le type de mouvement est obligatoire")
    private MovementType movementType;

    private String reference;
    private String reason;
}
