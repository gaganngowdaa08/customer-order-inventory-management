package com.akash.customerorderinventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private long totalCustomers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalSales;
}