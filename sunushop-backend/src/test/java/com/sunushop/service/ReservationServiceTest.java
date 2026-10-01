package com.sunushop.service;

import com.sunushop.model.dto.ReservationRequest;
import com.sunushop.model.entity.Article;
import com.sunushop.model.entity.Reservation;
import com.sunushop.model.enums.ReservationStatus;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.ReservationRepository;
import com.sunushop.service.stock.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ReservationService reservationService;

    private Article article;
    private ReservationRequest request;
    private Reservation reservation;

    @BeforeEach
    void setUp() {
        article = Article.builder()
            .id(1L)
            .reference("PP-A4-75G")
            .designation("Papier A4 75g")
            .category("Papier")
            .currentStockPhysical(100)
            .currentStockReserved(0)
            .build();

        request = ReservationRequest.builder()
            .articleId(1L)
            .clientId(100L)
            .quantity(20)
            .warehouseCode("DAK")
            .build();

        reservation = Reservation.builder()
            .id(1L)
            .articleId(1L)
            .clientId(100L)
            .quantity(20)
            .warehouseCode("DAK")
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusHours(48))
            .status(ReservationStatus.ACTIVE)
            .build();
    }

    @Test
    @DisplayName("Doit creer une reservation avec succes")
    void shouldCreateReservation() {
        // GIVEN
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(reservationRepository.sumActiveReservationsByArticleId(1L)).thenReturn(0);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        // WHEN
        Reservation result = reservationService.createReservation(request);

        // THEN
        assertThat(result).isNotNull();
        assertThat(result.getClientId()).isEqualTo(100L);
        assertThat(result.getQuantity()).isEqualTo(20);
        assertThat(result.getStatus()).isEqualTo(ReservationStatus.ACTIVE);
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Doit rejeter une reservation si quantite negative")
    void shouldRejectNegativeQuantity() {
        // GIVEN
        request.setQuantity(-10);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(reservationRepository.sumActiveReservationsByArticleId(1L)).thenReturn(0);

        // WHEN / THEN
        assertThatThrownBy(() -> reservationService.createReservation(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("positive");
    }

    @Test
    @DisplayName("Doit rejeter une reservation si stock insuffisant")
    void shouldRejectInsufficientStock() {
        // GIVEN
        request.setQuantity(500);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));
        when(reservationRepository.sumActiveReservationsByArticleId(1L)).thenReturn(0);

        // WHEN / THEN
        assertThatThrownBy(() -> reservationService.createReservation(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("insuffisant");
    }

    @Test
    @DisplayName("Doit annuler une reservation active")
    void shouldCancelReservation() {
        // GIVEN
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        // WHEN
        Reservation result = reservationService.cancelReservation(1L);

        // THEN
        assertThat(result.getStatus()).isEqualTo(ReservationStatus.CANCELLED);
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Doit rejeter l'annulation d'une reservation non active")
    void shouldRejectCancelNonActiveReservation() {
        // GIVEN
        reservation.setStatus(ReservationStatus.CANCELLED);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        // WHEN / THEN
        assertThatThrownBy(() -> reservationService.cancelReservation(1L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("plus active");
    }

    @Test
    @DisplayName("Doit retourner les reservations actives")
    void shouldReturnActiveReservations() {
        // GIVEN
        when(reservationRepository.findByStatusOrderByCreatedAtDesc(ReservationStatus.ACTIVE))
            .thenReturn(Arrays.asList(reservation));

        // WHEN
        List<Reservation> result = reservationService.getActiveReservations();

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getClientId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Doit calculer la quantite reservee active")
    void shouldCalculateActiveReservedQuantity() {
        // GIVEN
        when(reservationRepository.sumActiveReservationsByArticleId(1L)).thenReturn(50);

        // WHEN
        int result = reservationService.getActiveReservedQuantity(1L);

        // THEN
        assertThat(result).isEqualTo(50);
    }

    @Test
    @DisplayName("Doit expirer les reservations passees")
    void shouldExpireReservations() {
        // GIVEN
        Reservation expired = Reservation.builder()
            .id(2L)
            .articleId(1L)
            .clientId(200L)
            .quantity(10)
            .warehouseCode("DAK")
            .createdAt(LocalDateTime.now().minusDays(3))
            .expiresAt(LocalDateTime.now().minusHours(1))
            .status(ReservationStatus.ACTIVE)
            .build();

        when(reservationRepository.findExpiredReservations(any(LocalDateTime.class)))
            .thenReturn(Arrays.asList(expired));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(expired);

        // WHEN
        reservationService.expireReservations();

        // THEN
        assertThat(expired.getStatus()).isEqualTo(ReservationStatus.EXPIRED);
        verify(reservationRepository).save(expired);
    }
}