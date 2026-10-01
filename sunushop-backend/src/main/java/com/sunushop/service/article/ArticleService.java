package com.sunushop.service.article;

import com.sunushop.model.dto.ArticleDto;
import com.sunushop.model.dto.ArticleRequest;
import com.sunushop.model.entity.Article;
import com.sunushop.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Transactional(readOnly = true)
    public List<ArticleDto> getAllArticles() {
        return articleRepository.findAll()
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ArticleDto getArticleById(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article non trouve: " + id));
        return toDto(article);
    }

    @Transactional
    public ArticleDto createArticle(ArticleRequest request) {
        // Verifier l'unicite de la reference
        articleRepository.findByReference(request.getReference())
            .ifPresent(existing -> {
                throw new RuntimeException("Article avec reference " + request.getReference() + " existe deja");
            });

        Article article = Article.builder()
            .reference(request.getReference())
            .designation(request.getDesignation())
            .category(request.getCategory())
            .currentStockPhysical(request.getCurrentStockPhysical())
            .currentStockReserved(request.getCurrentStockReserved() != null ? request.getCurrentStockReserved() : 0)
            .build();
        Article saved = articleRepository.save(article);
        return toDto(saved);
    }

    private ArticleDto toDto(Article article) {
        int available = article.getCurrentStockPhysical() - article.getCurrentStockReserved();
        return ArticleDto.builder()
            .id(article.getId())
            .reference(article.getReference())
            .designation(article.getDesignation())
            .category(article.getCategory())
            .currentStockPhysical(article.getCurrentStockPhysical())
            .currentStockReserved(article.getCurrentStockReserved())
            .currentStockAvailable(available)
            .createdAt(article.getCreatedAt())
            .updatedAt(article.getUpdatedAt())
            .build();
    }
}