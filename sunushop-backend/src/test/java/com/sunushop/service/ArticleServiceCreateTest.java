package com.sunushop.service;

import com.sunushop.model.dto.ArticleRequest;
import com.sunushop.model.dto.ArticleDto;
import com.sunushop.model.entity.Article;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.service.article.ArticleService;
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
class ArticleServiceCreateTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleService articleService;

    private ArticleRequest request;

    @BeforeEach
    void setUp() {
        request = ArticleRequest.builder()
            .reference("NEW-001")
            .designation("Nouvel article")
            .category("Papier")
            .currentStockPhysical(0)
            .currentStockReserved(0)
            .build();
    }

    @Test
    @DisplayName("Doit creer un nouvel article")
    void shouldCreateArticle() {
        Article saved = Article.builder()
            .id(1L)
            .reference("NEW-001")
            .designation("Nouvel article")
            .category("Papier")
            .currentStockPhysical(0)
            .currentStockReserved(0)
            .build();

        // Le service appelle findByReference puis save
        when(articleRepository.findByReference("NEW-001")).thenReturn(Optional.empty());
        when(articleRepository.save(any(Article.class))).thenReturn(saved);

        ArticleDto result = articleService.createArticle(request);

        assertThat(result).isNotNull();
        assertThat(result.getReference()).isEqualTo("NEW-001");
        verify(articleRepository).findByReference("NEW-001");
        verify(articleRepository).save(any(Article.class));
    }

    @Test
    @DisplayName("Doit rejeter un article avec reference existante")
    void shouldRejectDuplicateReference() {
        Article existing = Article.builder().id(1L).reference("NEW-001").build();
        when(articleRepository.findByReference("NEW-001")).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> articleService.createArticle(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("existe");

        verify(articleRepository, never()).save(any(Article.class));
    }

    @Test
    @DisplayName("Doit retourner stock disponible = physique si pas de reserve")
    void shouldReturnPhysicalStockWhenNoReservation() {
        Article article = Article.builder()
            .id(1L)
            .reference("PP-A4-75G")
            .currentStockPhysical(100)
            .currentStockReserved(0)
            .build();

        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));

        ArticleDto result = articleService.getArticleById(1L);

        assertThat(result.getCurrentStockAvailable()).isEqualTo(100);
    }

    @Test
    @DisplayName("Doit calculer stock disponible avec reservation")
    void shouldCalculateAvailableWithReservation() {
        Article article = Article.builder()
            .id(1L)
            .reference("PP-A4-75G")
            .currentStockPhysical(100)
            .currentStockReserved(30)
            .build();

        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));

        ArticleDto result = articleService.getArticleById(1L);

        assertThat(result.getCurrentStockAvailable()).isEqualTo(70);
    }
}