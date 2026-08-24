-- รองรับภาษาไทย utf8mb4
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

CREATE TABLE `categories` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	`description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	`price` DOUBLE,
	`category_id` INT,
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `customers` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	`address` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	`phone` VARCHAR(20),
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`date` DATETIME,
	`customer_id` INT,
	`status` ENUM('delivered', 'received', 'processing'),
	`total_amount` DOUBLE,
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INT NOT NULL,
	`product_id` INT NOT NULL,
	`quantity` INT NOT NULL,
	`price` DOUBLE NOT NULL,
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_images` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`product_id` INT NOT NULL,
	`image_name` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	`created_at` TIMESTAMP DEFAULT now(),
	PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `products`
ADD FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `orders`
ADD FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `order_items`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE `order_items`
ADD FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `product_images`
ADD FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
ON UPDATE NO ACTION ON DELETE CASCADE;