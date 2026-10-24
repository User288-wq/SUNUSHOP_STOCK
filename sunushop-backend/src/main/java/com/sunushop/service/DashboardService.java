package com.sunushop.service;

import com.sunushop.model.dto.DashboardStatsDto;
import com.sunushop.model.entity.Article;
import com.sunushop.repository.ArticleRepository;
import com.sunushop.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ArticleRepository articleRepository;
    private final ReservationRepository reservationRepository;

    public DashboardStatsDto getStats() {
        long totalArticles = articleRepository.count();
        long totalReservations = reservationRepository.count();

        List<Object[]> categoryData = articleRepository.sumStockByCategory();
        Map<String, Long> stockByCategory = new LinkedHashMap<>();
        for (Object[] row : categoryData) {
            String category = (String) row[0];
            Long totalStock = ((Number) row[1]).longValue();
            stockByCategory.put(category, totalStock);
        }

        List<Article> topArticles = articleRepository.findTop5ByOrderByCurrentStockPhysicalDesc();
        List<DashboardStatsDto.ChartItem> top5 = topArticles.stream()
                .map(a -> DashboardStatsDto.ChartItem.builder()
                        .name(a.getDesignation())
                        .value(a.getCurrentStockPhysical())
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalArticles(totalArticles)
                .totalReservations(totalReservations)
                .stockByCategory(stockByCategory)
                .top5Articles(top5)
                .build();
    }
}