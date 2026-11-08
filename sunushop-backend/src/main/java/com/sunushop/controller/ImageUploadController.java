package com.sunushop.controller;

import com.sunushop.model.dto.ArticleDto;
import com.sunushop.model.entity.Article;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/v2/articles")
@RequiredArgsConstructor
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;
    private final ArticleRepository articleRepository;

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Article article = articleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Article non trouve"));

            // public_id unique pour chaque article
            String publicId = "article_" + id + "_" + System.currentTimeMillis();
            
            String imageUrl = cloudinaryService.uploadImage(file, publicId);
            article.setImageUrl(imageUrl);
            articleRepository.save(article);

            ArticleDto dto = ArticleDto.builder()
                    .id(article.getId())
                    .reference(article.getReference())
                    .designation(article.getDesignation())
                    .category(article.getCategory())
                    .imageUrl(imageUrl)
                    .currentStockPhysical(article.getCurrentStockPhysical())
                    .currentStockReserved(article.getCurrentStockReserved())
                    .build();

            return ResponseEntity.ok(dto);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur upload : " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}