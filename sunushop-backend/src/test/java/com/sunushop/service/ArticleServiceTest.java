package com.sunushop.service;

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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleService articleService;

    private Article article1;
    private Article article2;

    @BeforeEach
    void setUp() {
        article1 = Article.builder()
            .id(1L)
            .reference("PP-A4-75G")
            .designation("Papier A4 75g")
            .category("Papier")
            .currentStockPhysical(200)
            .currentStockReserved(0)
            .build();

        article2 = Article.builder()
            .id(2L)
            .reference("CAR-EP-100")
            .designation("Cartouche EPSON 100")
            .category("Cartouche")
            .currentStockPhysical(50)
            .currentStockReserved(10)
            .build();
    }

    @Test
    @DisplayName("Doit retourner la liste des articles")
    void shouldReturnAllArticles() {
        // GIVEN
        when(articleRepository.findAll()).thenReturn(Arrays.asList(article1, article2));

        // WHEN
        List<ArticleDto> result = articleService.getAllArticles();

        // THEN
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getReference()).isEqualTo("PP-A4-75G");
        assertThat(result.get(1).getReference()).isEqualTo("CAR-EP-100");
        verify(articleRepository).findAll();
    }

    @Test
    @DisplayName("Doit retourner un article par ID")
    void shouldReturnArticleById() {
        // GIVEN
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article1));

        // WHEN
        ArticleDto result = articleService.getArticleById(1L);

        // THEN
        assertThat(result.getReference()).isEqualTo("PP-A4-75G");
        assertThat(result.getCurrentStockPhysical()).isEqualTo(200);
    }

    @Test
    @DisplayName("Doit lever une exception si article non trouve")
    void shouldThrowWhenArticleNotFound() {
        // GIVEN
        when(articleRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> articleService.getArticleById(999L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("non trouve");
    }

    @Test
    @DisplayName("Doit calculer le stock disponible correctement")
    void shouldCalculateAvailableStock() {
        // GIVEN
        when(articleRepository.findById(2L)).thenReturn(Optional.of(article2));

        // WHEN
        ArticleDto result = articleService.getArticleById(2L);

        // THEN
        assertThat(result.getCurrentStockAvailable()).isEqualTo(40);
    }
}