package com.sunushop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunushop.model.dto.ReservationRequest;
import com.sunushop.model.entity.Article;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.ReservationRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    private Article testArticle;

    @BeforeEach
    void setUp() {
        reservationRepository.deleteAll();
        articleRepository.deleteAll();

        testArticle = Article.builder()
            .reference("TEST-RES-001")
            .designation("Article de test reservation")
            .category("Test")
            .currentStockPhysical(500)
            .currentStockReserved(0)
            .build();
        testArticle = articleRepository.save(testArticle);
    }

    @Test
    @DisplayName("POST /api/v2/reservations doit creer une reservation")
    void shouldCreateReservation() throws Exception {
        ReservationRequest request = ReservationRequest.builder()
            .articleId(testArticle.getId())
            .clientId(100L)
            .quantity(50)
            .warehouseCode("DAK")
            .build();

        mockMvc.perform(post("/v2/reservations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.clientId").value(100))
            .andExpect(jsonPath("$.quantity").value(50))
            .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    @DisplayName("GET /api/v2/reservations/active doit retourner la liste")
    void shouldReturnActiveReservations() throws Exception {
        mockMvc.perform(get("/v2/reservations/active"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("DELETE /api/v2/reservations/{id} doit annuler une reservation")
    void shouldCancelReservation() throws Exception {
        ReservationRequest request = ReservationRequest.builder()
            .articleId(testArticle.getId())
            .clientId(100L)
            .quantity(30)
            .warehouseCode("DAK")
            .build();

        String response = mockMvc.perform(post("/v2/reservations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

        Long reservationId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(delete("/v2/reservations/" + reservationId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @DisplayName("GET /api/v2/reservations/articles/{id}/reserved-quantity retourne la quantite")
    void shouldReturnReservedQuantity() throws Exception {
        mockMvc.perform(get("/v2/reservations/articles/" + testArticle.getId() + "/reserved-quantity"))
            .andExpect(status().isOk());
    }
}