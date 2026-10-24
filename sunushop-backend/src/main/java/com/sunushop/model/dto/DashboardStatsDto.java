package com.sunushop.model.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    private long totalArticles;
    private long totalReservations;
    private Map<String, Long> stockByCategory;
    private List<ChartItem> top5Articles;

    @Data
    @Builder
    public static class ChartItem {
        private String name;
        private long value;
    }
}