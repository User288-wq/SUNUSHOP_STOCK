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
public class ArticleDto {
    private Long id;
    private String reference;
    private String designation;
    private String category;
    private Integer currentStockPhysical;
    private Integer currentStockReserved;
    private Integer currentStockAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
