-- Add admin role to user_profiles table
ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'customer';

-- Create RLS policies for admin access
CREATE POLICY "Admins can view all profiles" 
ON user_profiles 
FOR SELECT 
USING (
  (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'))
  OR 
  (auth.uid() = id)
);

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile" 
ON user_profiles 
FOR UPDATE 
USING (
  (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'))
  OR 
  (auth.uid() = id)
);

-- Admin access to products table
CREATE POLICY "Admins can manage products" 
ON products 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'));

-- Admin access to product_variations table
CREATE POLICY "Admins can manage product variations" 
ON product_variations 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'));

-- Admin access to orders table
CREATE POLICY "Admins can view all orders" 
ON orders 
FOR SELECT 
USING (
  (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'))
  OR 
  (auth.uid() = user_id)
);

-- Admin access to order_items table
CREATE POLICY "Admins can view all order items" 
ON order_items 
FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  OR 
  (SELECT auth.uid() FROM orders WHERE orders.id = order_items.order_id) = auth.uid()
);