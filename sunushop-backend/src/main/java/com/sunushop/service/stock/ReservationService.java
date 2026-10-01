package com.sunushop.service.stock;

import com.sunushop.model.dto.ReservationRequest;
import com.sunushop.model.entity.Article;
import com.sunushop.model.entity.Reservation;
import com.sunushop.model.enums.ReservationStatus;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ArticleRepository articleRepository;

    private static final int RESERVATION_EXPIRY_HOURS = 48;
    private static final double MAX_RESERVATION_PERCENTAGE = 0.30;

    @Transactional
    public Reservation createReservation(ReservationRequest request) {
        log.info("Creation reservation : article={}, client={}, qty={}",
            request.getArticleId(), request.getClientId(), request.getQuantity());

        Article article = articleRepository.findById(request.getArticleId())
            .orElseThrow(() -> new RuntimeException("Article non trouve: " + request.getArticleId()));

        int currentReserved = getActiveReservedQuantity(article.getId());
        int stockPhysical = article.getCurrentStockPhysical();
        int available = stockPhysical - currentReserved;

        if (request.getQuantity() <= 0) {
            throw new RuntimeException("La quantite doit etre positive");
        }

        if (request.getQuantity() > available) {
            throw new RuntimeException(String.format(
                "Stock disponible insuffisant. Disponible: %d, Demande: %d",
                available, request.getQuantity()));
        }

        int maxReservation = (int) (stockPhysical * MAX_RESERVATION_PERCENTAGE);
        if (currentReserved + request.getQuantity() > maxReservation) {
            throw new RuntimeException(String.format(
                "Reservation maximale autorisee: %d%% du stock (%d unites)",
                (int)(MAX_RESERVATION_PERCENTAGE * 100), maxReservation));
        }

        Reservation reservation = Reservation.builder()
            .articleId(article.getId())
            .clientId(request.getClientId())
            .quantity(request.getQuantity())
            .warehouseCode(request.getWarehouseCode())
            .expiresAt(LocalDateTime.now().plusHours(RESERVATION_EXPIRY_HOURS))
            .status(ReservationStatus.ACTIVE)
            .build();

        Reservation saved = reservationRepository.save(reservation);

        log.info("Reservation {} creee, expire a {}", saved.getId(), saved.getExpiresAt());
        return saved;
    }

    @Transactional
    public Reservation cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation non trouvee: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new RuntimeException("Reservation n est plus active");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getActiveReservations() {
        return reservationRepository.findByStatusOrderByCreatedAtDesc(ReservationStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public int getActiveReservedQuantity(Long articleId) {
        Integer sum = reservationRepository.sumActiveReservationsByArticleId(articleId);
        return sum != null ? sum : 0;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireReservations() {
        List<Reservation> expired = reservationRepository.findExpiredReservations(LocalDateTime.now());

        if (expired.isEmpty()) {
            return;
        }

        log.info("Job expiration : {} reservations a expirer", expired.size());

        for (Reservation r : expired) {
            r.setStatus(ReservationStatus.EXPIRED);
            reservationRepository.save(r);
            log.info("Reservation {} expiree (article={}, qty={})",
                r.getId(), r.getArticleId(), r.getQuantity());
        }
    }
}