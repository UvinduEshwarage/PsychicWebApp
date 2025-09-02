/* Creating the database */
CREATE DATABASE psychicdb;
USE psychicdb;

/* Creating the Tables */

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(50),
    contact VARCHAR(20),
    address varchar(50)
);

CREATE TABLE place (
    place_id INT PRIMARY KEY AUTO_INCREMENT,
    placeName VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    rating INT,
    comment VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    roleStatus VARCHAR(10),
    description VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CHECK (roleStatus IN ('Admin', 'user'))
);

/* ORDERS */
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total DECIMAL(10,2),
    created_at DATETIME DEFAULT NOW(),
    orderstatus VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    CHECK (orderstatus IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

CREATE TABLE category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(30)
);


CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    productName VARCHAR(50),
    productDescription VARCHAR(255),
    price DECIMAL(10,2),
    imageURL VARCHAR(200),
    created_at DATETIME DEFAULT NOW(),
    stock INT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

/* ORDER ITEMS (junction table) */
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


