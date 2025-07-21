
-- Update product image URLs to use Supabase storage bucket
-- Assuming standard naming convention for uploaded files

-- E-liquid products
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/tropical-eliquid-30ml.jpg' WHERE id = 'eliq-tropical-30';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/sour-apple-eliquid-30ml.jpg' WHERE id = 'eliq-sour-apple-30';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/bubblegum-eliquid-30ml.jpg' WHERE id = 'eliq-bubblegum-30';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/mixed-pack-eliquid.jpg' WHERE id = 'eliq-mixed-pack';

-- Cookie products
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/chocolate-chip-cookies.jpg' WHERE id = 'cook-choc-chip';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/variety-pack-cookies.jpg' WHERE id = 'cook-variety-pack';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/glazed-special-cookies.jpg' WHERE id = 'cook-glazed-special';

-- Gummy products (if you have any)
-- UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/gummy-product.jpg' WHERE id = 'gummy-product-id';

-- Chocolate bar products (if you have any)
-- UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/chocolate-bar.jpg' WHERE id = 'chocolate-bar-id';
