package com.sunushop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunushop.model.dto.MovementRequest;
import com.sunushop.model.entity.Article;
import com.sunushop.model.enums.MovementType;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class StockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    private Article testArticle;

    @BeforeEach
    void setUp() {
        stockMovementRepository.deleteAll();
        articleRepository.deleteAll();

        testArticle = Article.builder()
            .reference("TEST-CTRL-001")
            .designation("Article de test controller")
            .category("Test")
            .currentStockPhysical(100)
            .currentStockReserved(0)
            .build();
        testArticle = articleRepository.save(testArticle);
    }

    @Test
    @DisplayName("GET /api/v2/stocks/health doit retourner 200 OK")
    void shouldReturnHealth() throws Exception {
        mockMvc.perform(get("/v2/stocks/health"))
            .andExpect(status().isOk())
            .andExpect(content().string("SunuShop Stock API operationnelle"));
    }

    @Test
    @DisplayName("POST /api/v2/stocks/movements doit creer un mouvement")
    void shouldCreateMovement() throws Exception {
        MovementRequest request = MovementRequest.builder()
            .articleId(testArticle.getId())
            .warehouseCode("DAK")
            .quantity(50)
            .movementType(MovementType.RECEPTION)
            .reference("BL-CTRL-001")
            .reason("Test controller")
            .build();

        mockMvc.perform(post("/v2/stocks/movements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.articleId").value(testArticle.getId()))
            .andExpect(jsonPath("$.stockPhysical").value(150))
            .andExpect(jsonPath("$.movementType").value("RECEPTION"))
            .andExpect(jsonPath("$.message").value("Mouvement enregistre avec succes"));
    }

    @Test
    @DisplayName("POST /api/v2/stocks/movements avec stock insuffisant retourne 400")
    void shouldReturn400WhenInsufficientStock() throws Exception {
        MovementRequest request = MovementRequest.builder()
            .articleId(testArticle.getId())
            .warehouseCode("DAK")
            .quantity(-500)
            .movementType(MovementType.SORTIE)
            .reason("Test stock insuffisant")
            .build();

        mockMvc.perform(post("/v2/stocks/movements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("BUSINESS_ERROR"))
            .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("GET /api/v2/stocks/articles/{id}/movements retourne l'historique")
    void shouldReturnMovementHistory() throws Exception {
        mockMvc.perform(get("/v2/stocks/articles/" + testArticle.getId() + "/movements"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
}