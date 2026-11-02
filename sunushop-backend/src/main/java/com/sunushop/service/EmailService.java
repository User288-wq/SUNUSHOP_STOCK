package com.sunushop.service;

import com.sunushop.model.entity.Article;
import com.sunushop.model.entity.Reservation;
import com.sunushop.model.entity.User;
import com.sunushop.model.enums.ReservationStatus;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.ReservationRepository;
import com.sunushop.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ReservationRepository reservationRepository;

    @Value("${sunushop.mail.from:noreply@sunushop.com}")
    private String fromEmail;

    @Value("${sunushop.low-stock-threshold:5}")
    private int lowStockThreshold;

    // ========== 1. ALERTE STOCK BAS (tous les jours a 8h) ==========
    @Scheduled(cron = "0 0 8 * * *")
    public void checkLowStockAndNotify() {
        log.info("Verification des stocks bas (seuil={})...", lowStockThreshold);

        List<Article> lowStockArticles = articleRepository.findAll().stream()
                .filter(a -> availableStock(a) <= lowStockThreshold)
                .toList();

        if (lowStockArticles.isEmpty()) {
            log.info("Aucun article en stock bas.");
            return;
        }

        List<User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null
                        && "ADMIN".equals(u.getRole().name())
                        && u.getEmail() != null
                        && !u.getEmail().isBlank())
                .toList();

        for (User admin : admins) {
            StringBuilder body = new StringBuilder("<p>Bonjour <strong>")
                    .append(admin.getUsername())
                    .append("</strong>,</p>")
                    .append("<p>Les articles suivants sont en <strong>stock bas</strong> :</p><ul>");

            for (Article a : lowStockArticles) {
                body.append("<li><strong>").append(a.getDesignation()).append("</strong> (")
                        .append(a.getReference()).append(") - Disponible : <strong>")
                        .append(availableStock(a)).append("</strong> / Seuil : ")
                        .append(lowStockThreshold)
                        .append(" (physique: ").append(a.getCurrentStockPhysical())
                        .append(", reserve: ").append(a.getCurrentStockReserved())
                        .append(")</li>");
            }
            body.append("</ul><p>Pensez a reapprovisionner.</p>");

            sendHtmlEmail(
                    admin.getEmail(),
                    "Alerte stock bas - " + lowStockArticles.size() + " article(s)",
                    buildEmailTemplate("Alerte stock bas", body.toString())
            );
        }
        log.info("Alertes stock envoyees a {} admin(s).", admins.size());
    }

    // ========== 2. RAPPEL RESERVATION (toutes les heures) ==========
    @Scheduled(cron = "0 0 * * * *")
    public void checkReservationsExpiringSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in2Hours = now.plusHours(2);

        List<Reservation> expiring = reservationRepository.findAll().stream()
                .filter(r -> r.getExpiresAt() != null)
                .filter(r -> r.getExpiresAt().isAfter(now) && r.getExpiresAt().isBefore(in2Hours))
                .filter(r -> r.getStatus() == ReservationStatus.ACTIVE)
                .filter(r -> !r.isExpirationEmailSent())
                .toList();

        if (expiring.isEmpty()) return;
        log.info("{} reservation(s) expirent bientot, envoi des rappels...", expiring.size());

        for (Reservation r : expiring) {
            User client = userRepository.findById(r.getClientId()).orElse(null);
            Article article = articleRepository.findById(r.getArticleId()).orElse(null);

            if (client == null || article == null
                    || client.getEmail() == null || client.getEmail().isBlank()) {
                log.warn("Reservation {} ignoree (client/article/email manquant)", r.getId());
                r.setExpirationEmailSent(true);
                reservationRepository.save(r);
                continue;
            }

            try {
                sendReservationExpirationEmail(
                        client.getEmail(),
                        client.getUsername(),
                        article.getDesignation(),
                        r.getId(),
                        r.getExpiresAt()
                );
                r.setExpirationEmailSent(true);
                reservationRepository.save(r);
            } catch (Exception e) {
                log.error("Impossible d envoyer le rappel pour la reservation {}", r.getId(), e);
            }
        }
    }

    // ========== Helpers ==========

    private int availableStock(Article a) {
        int physical = a.getCurrentStockPhysical() == null ? 0 : a.getCurrentStockPhysical();
        int reserved = a.getCurrentStockReserved() == null ? 0 : a.getCurrentStockReserved();
        return physical - reserved;
    }

    public void sendReservationExpirationEmail(String to, String username, String articleName,
                                               Long reservationId, LocalDateTime expiresAt) {
        String html = buildEmailTemplate(
                "Reservation sur le point d expirer",
                "<p>Bonjour <strong>" + username + "</strong>,</p>" +
                "<p>Votre reservation pour l article <strong>\"" + articleName + "\"</strong> " +
                "(ID: " + reservationId + ") expire le <strong>" + expiresAt + "</strong>, " +
                "soit dans moins de <strong>2 heures</strong>.</p>" +
                "<p>Merci de finaliser votre achat avant expiration.</p>"
        );
        sendHtmlEmail(to, "Votre reservation expire bientot - SunuShop Stock", html);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email envoye a {}", to);
        } catch (Exception e) {
            log.error("Echec de l envoi d email a {} : {}", to, e.getMessage());
        }
    }

    private String buildEmailTemplate(String title, String content) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; background: #f4f6f8; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>" +
                "<div style='background: #3498db; color: white; padding: 24px; text-align: center;'>" +
                "<h1 style='margin: 0; font-size: 22px;'>SunuShop Stock</h1>" +
                "<p style='margin: 4px 0 0; opacity: 0.9;'>" + title + "</p>" +
                "</div>" +
                "<div style='padding: 28px; color: #2c3e50; line-height: 1.6;'>" + content + "</div>" +
                "<div style='background: #ecf0f1; padding: 16px; text-align: center; font-size: 12px; color: #7f8c8d;'>" +
                "SunuShop Stock - Application de gestion de stock" +
                "</div></div></body></html>";
    }
}