package com.sunushop.controller;

import com.sunushop.model.dto.ArticleDto;
import com.sunushop.model.dto.ArticleRequest;
import com.sunushop.service.article.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v2/articles")
@RequiredArgsConstructor
public class ArticleController {

    // On injecte le Service au lieu du Repository !
    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<Page<ArticleDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        
        // On crée la configuration de pagination (page demandée, taille, tri par désignation)
        Pageable pageable = PageRequest.of(page, size, Sort.by("designation").ascending());
        
        // On appelle le service
        Page<ArticleDto> articles = articleService.getAllArticles(search, pageable);
        
        return ResponseEntity.ok(articles);
    }

    @PostMapping
    public ResponseEntity<ArticleDto> create(@RequestBody ArticleRequest request) {
        // On utilise le service pour créer l'article
        ArticleDto created = articleService.createArticle(request);
        return ResponseEntity.ok(created);
    }
}
