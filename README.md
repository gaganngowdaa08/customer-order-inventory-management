# Customer Order & Inventory Management System

A full-stack web application for managing customers, products, orders, and inventory through a web-based interface and RESTful APIs.

The system is designed to simulate a real-world business workflow where customers place orders, products are validated against available stock, order totals are calculated automatically, and inventory is updated after successful order placement.

---

## 🚀 Features

### 👤 Customer Management

- Add new customers
- View all customers
- Update customer details
- Delete customers
- Input validation for customer information

### 📦 Product Management

- Add products
- View products
- Update product details
- Delete products
- Track product price and category
- Manage available stock quantity

### 🛒 Order Management

- Create orders for customers
- Add multiple products to a single order
- Validate product availability before placing an order
- Calculate item subtotal automatically
- Calculate complete order total automatically
- Automatically reduce inventory after a successful order

### 📊 Dashboard

Provides an overview of:

- Total customers
- Total products
- Total orders
- Total sales

### 📋 Inventory Management

- View available stock
- Identify low-stock products
- Identify out-of-stock products
- Track stock changes after orders

### 🛡️ Validation & Error Handling

- Request validation using Spring Boot Validation
- Global exception handling
- Customer and product not-found handling
- Insufficient-stock validation

---

## 🛠️ Technology Stack

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

### Frontend

- React JS
- JavaScript
- HTML
- CSS
- Axios

### Database

- MySQL

### Development & Testing

- IntelliJ IDEA
- Postman
- Git
- GitHub

---

## 🏗️ Application Architecture

```text
React JS Frontend
       ↓
   REST APIs
       ↓
Spring Boot Backend
       ↓
Spring Data JPA
       ↓
   Hibernate
       ↓
     MySQLgit