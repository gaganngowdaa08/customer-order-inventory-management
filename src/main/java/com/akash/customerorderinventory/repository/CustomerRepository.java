package com.akash.customerorderinventory.repository;

import com.akash.customerorderinventory.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}