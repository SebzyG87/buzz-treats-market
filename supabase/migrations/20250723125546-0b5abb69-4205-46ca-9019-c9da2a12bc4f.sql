-- Update cookies category to have only one product with correct details
DELETE FROM products WHERE category = 'cookies' AND id != 'cook-std';

-- Update the remaining cookie product to match requirements
UPDATE products 
SET 
  name = 'Cookie',
  price_value = 11.00
WHERE id = 'cook-std' AND category = 'cookies';