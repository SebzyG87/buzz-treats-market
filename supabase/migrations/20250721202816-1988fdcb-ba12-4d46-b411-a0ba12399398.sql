
-- Delete existing e-liquid products
DELETE FROM products WHERE category = 'e-liquids';

-- Insert new e-liquid products using the uploaded images
INSERT INTO products (id, name, description, category, price_value, original_price, sku, stock_quantity, image_url) VALUES
('eliq-tropical-30', 'Tropical E-liquid 30ml', 'Premium tropical flavor e-liquid in 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-TROP-30', 15, '/lovable-uploads/7aaafe0f-32ae-4fbc-8377-a2b36ff43179.png'),
('eliq-sour-apple-30', 'Sour Apple E-liquid 30ml', 'Tangy sour apple flavor e-liquid in 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-SOUR-30', 12, '/lovable-uploads/c0d36e1a-f802-43c8-bf22-ade070a44990.png'),
('eliq-bubblegum-30', 'Bubblegum E-liquid 30ml', 'Sweet bubblegum flavor e-liquid in 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-BUBBLE-30', 18, '/lovable-uploads/4216a39d-717d-4c9a-90c5-58a6dded7942.png'),
('eliq-mixed-pack', 'E-liquid Mixed Pack', 'Variety pack of premium e-liquids with multiple flavors', 'e-liquids', 89.99, 120.00, 'ELIQ-MIXED-PACK', 8, '/lovable-uploads/b971e501-1fad-4b43-9d5c-84ba6623e475.png');
