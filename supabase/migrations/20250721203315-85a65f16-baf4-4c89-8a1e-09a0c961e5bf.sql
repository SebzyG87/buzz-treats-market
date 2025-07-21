-- Restore e-liquid products with the uploaded images
DELETE FROM products WHERE category = 'e-liquids';

INSERT INTO products (id, name, description, category, price_value, original_price, sku, stock_quantity, image_url) VALUES
('eliq-tropical-30', 'Tropical E-liquid 30ml', 'Premium tropical flavor e-liquid in 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-TROP-30', 15, '/lovable-uploads/7aaafe0f-32ae-4fbc-8377-a2b36ff43179.png'),
('eliq-sour-apple-30', 'Sour Apple E-liquid 30ml', 'Tangy sour apple flavor e-liquid in 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-SOUR-30', 12, '/lovable-uploads/c0d36e1a-f802-43c8-bf22-ade070a44990.png'),
('eliq-bubblegum-30', 'Bubblegum E-liquid 30ml', 'Sweet bubblegum flavor e-liquid in 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-BUBBLE-30', 18, '/lovable-uploads/4216a39d-717d-4c9a-90c5-58a6dded7942.png'),
('eliq-mixed-pack', 'E-liquid Mixed Pack', 'Variety pack of premium e-liquids with multiple flavors', 'e-liquids', 89.99, 120.00, 'ELIQ-MIXED-PACK', 8, '/lovable-uploads/b971e501-1fad-4b43-9d5c-84ba6623e475.png');

-- Add more cookie products with the new uploaded images
INSERT INTO products (id, name, description, category, price_value, original_price, sku, stock_quantity, image_url) VALUES
('cook-choc-chip', 'Chocolate Chip Cookie', 'Classic chocolate chip cookie with premium ingredients', 'cookies', 12.99, NULL, 'COOK-CHOC-CHIP', 25, '/lovable-uploads/7b1e0bc0-eb39-4de4-897f-9683dade879d.png'),
('cook-variety-pack', 'Cookie Variety Pack', 'Assorted pack of our finest cookies in different sizes', 'cookies', 24.99, 28.00, 'COOK-VARIETY', 20, '/lovable-uploads/6940c75a-c704-4a2b-8601-c36f887ebc48.png'),
('cook-glazed-special', 'Glazed Special Cookie', 'Premium glazed cookie with white chocolate drizzle', 'cookies', 15.99, NULL, 'COOK-GLAZED', 18, '/lovable-uploads/ccf2ee9c-15ab-41b7-b4ce-2acb403ada23.png');