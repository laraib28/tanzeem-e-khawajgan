-- Migration: 001_create_banquet_tables.sql
-- Feature: 002-banquet-booking-agent
-- Created: 2026-01-20

-- Banquet Halls Table
CREATE TABLE IF NOT EXISTS banquet_halls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    amenities JSON,
    price_per_hour DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hall_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    event_type VARCHAR(100),
    guest_count INT NOT NULL,
    special_requirements TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
    whatsapp_optin BOOLEAN DEFAULT FALSE,
    booking_reference VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hall_id) REFERENCES banquet_halls(id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_hall_date (hall_id, booking_date),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_reference (booking_reference)
);

-- Booking Audit Log
CREATE TABLE IF NOT EXISTS booking_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    action VARCHAR(50) NOT NULL,
    actor VARCHAR(100),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    INDEX idx_booking (booking_id)
);

-- Notification Log
CREATE TABLE IF NOT EXISTS notification_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    channel ENUM('whatsapp', 'email', 'sms') NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    INDEX idx_booking (booking_id),
    INDEX idx_status (status)
);

-- Seed Initial Hall Data
INSERT INTO banquet_halls (name, capacity, amenities, price_per_hour, status) VALUES
('Grand Hall', 500, '["AC", "Stage", "Sound System", "Parking", "Catering Area"]', 5000.00, 'active'),
('Conference Room A', 50, '["AC", "Projector", "Whiteboard", "WiFi"]', 1000.00, 'active'),
('Garden Lawn', 300, '["Open Air", "Stage", "Catering Area", "Parking"]', 3000.00, 'active');
