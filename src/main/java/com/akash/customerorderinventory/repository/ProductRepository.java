package com.akash.customerorderinventory.repository;

import com.akash.customerorderinventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}