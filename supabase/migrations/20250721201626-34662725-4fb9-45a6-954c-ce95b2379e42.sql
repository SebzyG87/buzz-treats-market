-- Add original_price column first
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- Clear existing products
DELETE FROM products;

-- Insert the complete and accurate product catalog
INSERT INTO products (id, name, description, category, price_value, original_price, sku, stock_quantity, image_url) VALUES
-- Gummies
('gum-1000-5', '1000 (5 sweets)', 'Premium strength gummies pack of 5', 'gummies', 41.97, 55.00, 'GUM-1000-5', 10, 'https://images.unsplash.com/photo-1582062135279-2d2b4ac10b94?w=400&h=300&fit=crop'),
('gum-1000-2', '1000mg (2 Sweets)', 'High strength gummies pack of 2', 'gummies', 26.99, NULL, 'GUM-1000-2', 15, 'https://images.unsplash.com/photo-1582062135279-2d2b4ac10b94?w=400&h=300&fit=crop'),
('gum-500-5', '500mg (5 Sweets)', 'Medium strength gummies pack of 5', 'gummies', 31.99, 35.00, 'GUM-500-5', 20, 'https://images.unsplash.com/photo-1582062135279-2d2b4ac10b94?w=400&h=300&fit=crop'),
('gum-500-3', '500mg (3 Sweets)', 'Medium strength gummies pack of 3', 'gummies', 21.99, NULL, 'GUM-500-3', 18, 'https://images.unsplash.com/photo-1582062135279-2d2b4ac10b94?w=400&h=300&fit=crop'),
('gum-250-3', '250mg (3 Sweets)', 'Mild strength gummies pack of 3', 'gummies', 16.99, NULL, 'GUM-250-3', 25, 'https://images.unsplash.com/photo-1582062135279-2d2b4ac10b94?w=400&h=300&fit=crop'),
('gum-250-5', '250mg (5 Sweets)', 'Mild strength gummies pack of 5', 'gummies', 21.98, 25.00, 'GUM-250-5', 22, 'https://images.unsplash.com/photo-1582062135279-2d2b4ac10b94?w=400&h=300&fit=crop'),

-- Chocolate Bars
('choc-500', '500mg Chocolate Bar', 'Premium chocolate bar with 500mg strength', 'chocolate-bars', 31.99, NULL, 'CHOC-500', 12, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop'),

-- Cookies
('cook-std', 'Cookie', 'Delicious baked cookie', 'cookies', 10.99, NULL, 'COOK-STD', 30, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'),

-- E-liquids
('eliq-30', 'Liquid 30ml', 'Premium e-liquid 30ml bottle', 'e-liquids', 31.99, NULL, 'ELIQ-30', 8, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop');