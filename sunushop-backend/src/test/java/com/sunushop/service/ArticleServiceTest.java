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
        Pageable pageable = PageRequest.of(0, 10);
        Article article = Article.builder()
                .id(1L)
                .reference("TEST-001")
                .designation("Article de test")
                .currentStockPhysical(10)
                .currentStockReserved(0)
                .build();
        
        Page<Article> articlePage = new PageImpl<>(Collections.singletonList(article), pageable, 1);
        when(articleRepository.findAll(any(Pageable.class))).thenReturn(articlePage);

        Page<ArticleDto> result = articleService.getAllArticles("", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("TEST-001", result.getContent().get(0).getReference());
    }

    @Test
    void testGetAllArticles_AvecRecherche() {
        Pageable pageable = PageRequest.of(0, 10);
        Article article = Article.builder()
                .id(2L)
                .reference("PAPIER-001")
                .designation("Papier A4")
                .currentStockPhysical(50)
                .currentStockReserved(0)
                .build();
        
        Page<Article> articlePage = new PageImpl<>(Collections.singletonList(article), pageable, 1);
        when(articleRepository.findByDesignationContainingIgnoreCaseOrReferenceContainingIgnoreCase(anyString(), anyString(), any(Pageable.class)))
                .thenReturn(articlePage);

        Page<ArticleDto> result = articleService.getAllArticles("Papier", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("PAPIER-001", result.getContent().get(0).getReference());
    }
}
