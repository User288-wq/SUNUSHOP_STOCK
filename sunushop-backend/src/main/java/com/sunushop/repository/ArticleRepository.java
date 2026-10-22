package com.sunushop.repository;

import com.sunushop.model.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findByReference(String reference);

    // Méthode ajoutée pour la recherche paginée (filtre sur designation OU reference)
    Page<Article> findByDesignationContainingIgnoreCaseOrReferenceContainingIgnoreCase(
        String designation, String reference, Pageable pageable
    );
}
