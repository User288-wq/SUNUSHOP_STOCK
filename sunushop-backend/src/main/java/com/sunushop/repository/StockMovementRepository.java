package com.sunushop.repository;

import com.sunushop.model.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByArticleIdOrderByMovementDateDesc(Long articleId);

    List<StockMovement> findByWarehouseCode(String warehouseCode);
}
