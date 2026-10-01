package com.sunushop.service;

import com.sunushop.model.dto.MovementRequest;
import com.sunushop.model.dto.MovementResponse;
import com.sunushop.model.entity.Article;
import com.sunushop.model.entity.StockMovement;
import com.sunushop.model.enums.MovementType;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.StockMovementRepository;
import com.sunushop.service.stock.StockMovementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockMovementServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private StockMovementRepository movementRepository;

    @InjectMocks
    private StockMovementService stockMovementService;

    private Article article;
    private MovementRequest request;

    @BeforeEach
    void setUp() {
        article = Article.builder()
            .id(1L)
            .reference("PP-A4-75G")
            .designation("Papier A4 75g")
            .category("Papier")
            .currentStockPhysical(200)
            .currentStockReserved(0)
            .build();

        request = MovementRequest.builder()
            .articleId(1L)
            .warehouseCode("DAK")
            .quantity(100)
            .movementType(MovementType.RECEPTION)
            .reference("BL-2025-001")
            .reason("Reception fournisseur")
            .build();
    }

    @Test
    @DisplayName("Doit enregistrer une RECEPTION et augmenter le stock")
    void shouldRecordReception() {
        // GIVEN
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(any(Article.class))).thenReturn(article);
        when(movementRepository.save(any(StockMovement.class))).thenReturn(new StockMovement());

        // WHEN
        MovementResponse response = stockMovementService.recordMovement(request);

        // THEN
        assertThat(response).isNotNull();
        assertThat(response.getStockPhysical()).isEqualTo(300);
        assertThat(response.getStockAvailable()).isEqualTo(300);
        verify(articleRepository).save(any(Article.class));
        verify(movementRepository).save(any(StockMovement.class));
    }

    @Test
    @DisplayName("Doit enregistrer une SORTIE et diminuer le stock")
    void shouldRecordExit() {
        // GIVEN
        request.setQuantity(-50);
        request.setMovementType(MovementType.SORTIE);

        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(articleRepository.save(any(Article.class))).thenReturn(article);
        when(movementRepository.save(any(StockMovement.class))).thenReturn(new StockMovement());

        // WHEN
        MovementResponse response = stockMovementService.recordMovement(request);

        // THEN
        assertThat(response.getStockPhysical()).isEqualTo(150);
        assertThat(response.getStockAvailable()).isEqualTo(150);
    }

    @Test
    @DisplayName("Doit rejeter une SORTIE si stock insuffisant")
    void shouldRejectExitWithInsufficientStock() {
        // GIVEN
        request.setQuantity(-500);
        request.setMovementType(MovementType.SORTIE);

        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));

        // WHEN / THEN
        assertThatThrownBy(() -> stockMovementService.recordMovement(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Stock insuffisant");

        verify(articleRepository, never()).save(any(Article.class));
    }

    @Test
    @DisplayName("Doit rejeter un mouvement si article non trouve")
    void shouldRejectWhenArticleNotFound() {
        // GIVEN
        when(articleRepository.findById(999L)).thenReturn(Optional.empty());
        request.setArticleId(999L);

        // WHEN / THEN
        assertThatThrownBy(() -> stockMovementService.recordMovement(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("non trouve");
    }

    @Test
    @DisplayName("Doit rejeter une RECEPTION avec quantite negative")
    void shouldRejectNegativeReception() {
        // GIVEN
        request.setQuantity(-10);
        request.setMovementType(MovementType.RECEPTION);

        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));

        // WHEN / THEN
        assertThatThrownBy(() -> stockMovementService.recordMovement(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("positive");
    }
}