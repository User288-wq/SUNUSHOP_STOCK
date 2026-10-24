package com.sunushop.service.article;

import com.sunushop.model.dto.ArticleDto;
import com.sunushop.model.entity.Article;
import com.sunushop.repository.ArticleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleService articleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllArticles_SansRecherche() {
        // 1. Préparation des données (Page de 10 éléments)
        Pageable pageable = PageRequest.of(0, 10);
        Article article = Article.builder()
                .id(1L)
                .reference("TEST-001")
                .designation("Article de test")
                .currentStockPhysical(10)
                .currentStockReserved(0)
                .build();
        
        Page<Article> articlePage = new PageImpl<>(Collections.singletonList(article), pageable, 1);

        // 2. Simulation du Repository
        when(articleRepository.findAll(any(Pageable.class))).thenReturn(articlePage);

        // 3. Appel de la nouvelle méthode avec les paramètres
        Page<ArticleDto> result = articleService.getAllArticles("", pageable);

        // 4. Vérifications
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("TEST-001", result.getContent().get(0).getReference());
    }

    @Test
    void testGetAllArticles_AvecRecherche() {
        // 1. Préparation
        Pageable pageable = PageRequest.of(0, 10);
        Article article = Article.builder()
                .id(2L)
                .reference("PAPIER-001")
                .designation("Papier A4")
                .currentStockPhysical(50)
                .currentStockReserved(0)
                .build();
        
        Page<Article> articlePage = new PageImpl<>(Collections.singletonList(article), pageable, 1);

        // 2. Simulation (recherche par nom ou référence)
        when(articleRepository.findByDesignationContainingIgnoreCaseOrReferenceContainingIgnoreCase(anyString(), anyString(), any(Pageable.class)))
                .thenReturn(articlePage);

        // 3. Appel de la méthode
        Page<ArticleDto> result = articleService.getAllArticles("Papier", pageable);

        // 4. Vérifications
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("PAPIER-001", result.getContent().get(0).getReference());
    }
}