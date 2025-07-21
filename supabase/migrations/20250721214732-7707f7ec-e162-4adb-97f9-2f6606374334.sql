-- Update remaining product image URLs to use their respective storage buckets

-- Cookie products
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/chocolate-chip-cookies.jpg' WHERE id = 'cook-choc-chip';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/variety-pack-cookies.jpg' WHERE id = 'cook-variety-pack';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/glazed-special-cookies.jpg' WHERE id = 'cook-glazed-special';

-- Update any gummy products (if they exist)
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/' || id || '.jpg' 
WHERE category = 'gummies' AND image_url IS NOT NULL;

-- Update any chocolate bar products (if they exist)
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/chocolate-bars/' || id || '.jpg' 
WHERE category = 'chocolate-bars' AND image_url IS NOT NULL;