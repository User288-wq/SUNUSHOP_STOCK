package com.sunushop.repository;

import com.sunushop.model.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findByReference(String reference);
    
    Page<Article> findByDesignationContainingIgnoreCaseOrReferenceContainingIgnoreCase(
        String designation, String reference, Pageable pageable
    );

    List<Article> findTop5ByOrderByCurrentStockPhysicalDesc();

    @Query("SELECT a.category, SUM(a.currentStockPhysical) FROM Article a GROUP BY a.category")
    List<Object[]> sumStockByCategory();
}