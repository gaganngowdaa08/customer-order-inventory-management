package com.akash.customerorderinventory.service;

import com.akash.customerorderinventory.dto.DashboardResponse;
import com.akash.customerorderinventory.repository.CustomerOrderRepository;
import com.akash.customerorderinventory.repository.CustomerRepository;
import com.akash.customerorderinventory.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CustomerOrderRepository customerOrderRepository;

    public DashboardService(
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            CustomerOrderRepository customerOrderRepository) {

        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.customerOrderRepository = customerOrderRepository;
    }

    public DashboardResponse getDashboardSummary() {

        long totalCustomers = customerRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = customerOrderRepository.count();

        BigDecimal totalSales = customerOrderRepository.findAll()
                .stream()
                .map(order -> order.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResponse(
                totalCustomers,
                totalProducts,
                totalOrders,
                totalSales
        );
    }
}