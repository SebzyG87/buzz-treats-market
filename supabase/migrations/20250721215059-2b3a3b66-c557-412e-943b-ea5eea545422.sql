-- Fix image URLs to match likely uploaded filenames

-- Update gummy products to use simpler naming
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/1000mg-5-sweets.jpg' WHERE id = 'gum-1000-5';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/1000mg-2-sweets.jpg' WHERE id = 'gum-1000-2';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/250mg-3-sweets.jpg' WHERE id = 'gum-250-3';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/250mg-5-sweets.jpg' WHERE id = 'gum-250-5';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/500mg-3-sweets.jpg' WHERE id = 'gum-500-3';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/500mg-5-sweets.jpg' WHERE id = 'gum-500-5';

-- Update chocolate bar products
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/chocolate-bars/500mg-chocolate-bar.jpg' WHERE id = 'choc-500';

-- Update the one cookie that still has placeholder
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/standard-cookie.jpg' WHERE id = 'cook-std';