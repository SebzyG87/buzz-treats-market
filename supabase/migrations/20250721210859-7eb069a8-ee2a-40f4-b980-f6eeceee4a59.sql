-- Update product image URLs to use the actual uploaded file names
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/1e-liquids.jpg' WHERE id = 'eliq-tropical-30';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/2e-liquids.jpg' WHERE id = 'eliq-sour-apple-30';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/3e-liquids.jpg' WHERE id = 'eliq-bubblegum-30';
UPDATE products SET image_url = 'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/4e-liquids.jpg' WHERE id = 'eliq-mixed-pack';