-- Update e-liquid product images to use accessible URLs
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop' WHERE id = 'eliq-tropical-30';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop' WHERE id = 'eliq-sour-apple-30';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop' WHERE id = 'eliq-bubblegum-30';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&sat=-20' WHERE id = 'eliq-mixed-pack';

-- Update cookie product images to use accessible URLs
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' WHERE id = 'cook-choc-chip';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&hue=30' WHERE id = 'cook-variety-pack';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&hue=60' WHERE id = 'cook-glazed-special';