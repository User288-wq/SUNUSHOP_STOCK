package com.sunushop.repository;

import com.sunushop.model.entity.Reservation;
import com.sunushop.model.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByStatusOrderByCreatedAtDesc(ReservationStatus status);

    @Query("SELECT COALESCE(SUM(r.quantity), 0) FROM Reservation r WHERE r.articleId = :articleId AND r.status = 'ACTIVE'")
    Integer sumActiveReservationsByArticleId(@Param("articleId") Long articleId);

    @Query("SELECT r FROM Reservation r WHERE r.status = 'ACTIVE' AND r.expiresAt < :now")
    List<Reservation> findExpiredReservations(@Param("now") LocalDateTime now);
}