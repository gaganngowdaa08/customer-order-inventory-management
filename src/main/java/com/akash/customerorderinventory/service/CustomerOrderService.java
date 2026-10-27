package com.akash.customerorderinventory.service;

import com.akash.customerorderinventory.dto.CreateOrderRequest;
import com.akash.customerorderinventory.dto.OrderItemRequest;
import com.akash.customerorderinventory.entity.Customer;
import com.akash.customerorderinventory.entity.CustomerOrder;
import com.akash.customerorderinventory.entity.OrderItem;
import com.akash.customerorderinventory.entity.Product;
import com.akash.customerorderinventory.exception.CustomerNotFoundException;
import com.akash.customerorderinventory.exception.InsufficientStockException;
import com.akash.customerorderinventory.exception.ProductNotFoundException;
import com.akash.customerorderinventory.exception.OrderNotFoundException;
import com.akash.customerorderinventory.repository.CustomerOrderRepository;
import com.akash.customerorderinventory.repository.CustomerRepository;
import com.akash.customerorderinventory.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerOrderService {

    private final CustomerOrderRepository customerOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CustomerOrderService(
            CustomerOrderRepository customerOrderRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository) {

        this.customerOrderRepository = customerOrderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public CustomerOrder createOrder(CreateOrderRequest request) {

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new CustomerNotFoundException(
                                "Customer not found with id: "
                                        + request.getCustomerId()));

        CustomerOrder order = new CustomerOrder();

        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new ProductNotFoundException(
                                    "Product not found with id: "
                                            + itemRequest.getProductId()));

            Integer quantity = itemRequest.getQuantity();

            if (product.getStockQuantity() < quantity) {
                throw new InsufficientStockException(
                        "Insufficient stock for product: "
                                + product.getName()
                                + ". Available stock: "
                                + product.getStockQuantity());
            }

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(quantity));

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setSubtotal(subtotal);

            order.getItems().add(orderItem);

            product.setStockQuantity(
                    product.getStockQuantity() - quantity
            );

            productRepository.save(product);

            totalAmount = totalAmount.add(subtotal);
        }

        order.setTotalAmount(totalAmount);

        return customerOrderRepository.save(order);
    }
    public List<CustomerOrder> getAllOrders() {
        return customerOrderRepository.findAll();
    }

    public CustomerOrder getOrderById(Long id) {
        return customerOrderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(
                        "Order not found with id: " + id));
    }
}