-- Update product image URLs to use actual uploaded files

-- Update gummies products to use actual uploaded images
UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/1gummies.jpeg'
WHERE id = 'gum-1000-5';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/2gummies.jpeg'
WHERE id = 'gum-1000-2';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/3gummies.jpeg'
WHERE id = 'gum-250-3';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/4gummies.jpeg'
WHERE id = 'gum-250-5';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/5gummies.jpeg'
WHERE id = 'gum-500-3';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/6gummies.jpeg'
WHERE id = 'gum-500-5';

-- Update chocolate bars products to use actual uploaded images
UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/chocolate-bars/3chocolate-bars.jpg'
WHERE id = 'choc-500';

-- Update cookies products to use actual uploaded images
UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/1cookies.jpeg'
WHERE id = 'cook-std';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/2cookies.jpeg'
WHERE id = 'cook-choc-chip';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/3cookies.jpeg'
WHERE id = 'cook-variety-pack';

UPDATE products 
SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/1cookies.jpeg'
WHERE id = 'cook-glazed-special';