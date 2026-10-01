package com.sunushop.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleRequest {

    @NotBlank(message = "La reference est obligatoire")
    private String reference;

    @NotBlank(message = "La designation est obligatoire")
    private String designation;

    private String category;

    @NotNull(message = "Le stock physique est obligatoire")
    private Integer currentStockPhysical;

    private Integer currentStockReserved;
}
