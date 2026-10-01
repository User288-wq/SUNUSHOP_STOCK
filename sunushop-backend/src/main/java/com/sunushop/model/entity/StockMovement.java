package com.sunushop.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_id", nullable = false)
    private Long articleId;

    @Column(name = "warehouse_code", nullable = false, length = 3)
    private String warehouseCode;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "movement_type", nullable = false, length = 30)
    private String movementType;

    @Column(name = "reference_document", length = 100)
    private String referenceDocument;

    @Column(length = 500)
    private String reason;

    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "movement_date", nullable = false)
    private LocalDateTime movementDate;

    @Column(name = "stock_before", nullable = false)
    private Integer stockBefore;

    @Column(name = "stock_after", nullable = false)
    private Integer stockAfter;
}
