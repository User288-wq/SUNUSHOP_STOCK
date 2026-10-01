package com.sunushop.service.stock;

import com.sunushop.model.dto.MovementRequest;
import com.sunushop.model.dto.MovementResponse;
import com.sunushop.model.entity.Article;
import com.sunushop.model.entity.StockMovement;
import com.sunushop.model.enums.MovementType;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockMovementService {

    private final ArticleRepository articleRepository;
    private final StockMovementRepository movementRepository;

    @Transactional
    public MovementResponse recordMovement(MovementRequest request) {
        log.info("Mouvement : article={}, qty={}, type={}",
            request.getArticleId(), request.getQuantity(), request.getMovementType());

        Article article = articleRepository.findById(request.getArticleId())
            .orElseThrow(() -> new RuntimeException(
                "Article non trouve: " + request.getArticleId()));

        MovementType type = request.getMovementType();
        int stockBefore = article.getCurrentStockPhysical();
        int quantity = request.getQuantity();

        switch (type) {
            case RECEPTION:
                if (quantity <= 0) {
                    throw new RuntimeException("Une reception doit avoir une quantite positive");
                }
                article.setCurrentStockPhysical(stockBefore + quantity);
                break;

            case SORTIE:
                int available = stockBefore - article.getCurrentStockReserved();
                if (Math.abs(quantity) > available) {
                    throw new RuntimeException(
                        String.format("Stock insuffisant. Disponible: %d, Demande: %d",
                            available, Math.abs(quantity)));
                }
                article.setCurrentStockPhysical(stockBefore - Math.abs(quantity));
                break;

            case AJUSTEMENT:
                if (quantity < article.getCurrentStockReserved()) {
                    throw new RuntimeException("Ajustement inferieur au stock reserve");
                }
                article.setCurrentStockPhysical(quantity);
                break;

            default:
                throw new RuntimeException("Type non supporte: " + type);
        }

        article.setUpdatedAt(LocalDateTime.now());
        Article savedArticle = articleRepository.save(article);

        StockMovement movement = StockMovement.builder()
            .articleId(savedArticle.getId())
            .warehouseCode(request.getWarehouseCode())
            .quantity(quantity)
            .movementType(type.name())
            .referenceDocument(request.getReference())
            .reason(request.getReason())
            .userId("SYSTEM")
            .movementDate(LocalDateTime.now())
            .stockBefore(stockBefore)
            .stockAfter(savedArticle.getCurrentStockPhysical())
            .build();

        StockMovement saved = movementRepository.save(movement);

        int newAvailable = savedArticle.getCurrentStockPhysical()
                         - savedArticle.getCurrentStockReserved();

        return MovementResponse.builder()
            .movementId(saved.getId())
            .articleId(savedArticle.getId())
            .warehouseCode(request.getWarehouseCode())
            .quantity(quantity)
            .movementType(type.name())
            .stockPhysical(savedArticle.getCurrentStockPhysical())
            .stockReserved(savedArticle.getCurrentStockReserved())
            .stockAvailable(newAvailable)
            .timestamp(saved.getMovementDate())
            .message("Mouvement enregistre avec succes")
            .build();
    }

    @Transactional(readOnly = true)
    public List<StockMovement> getMovementsByArticle(Long articleId) {
        return movementRepository.findByArticleIdOrderByMovementDateDesc(articleId);
    }
}