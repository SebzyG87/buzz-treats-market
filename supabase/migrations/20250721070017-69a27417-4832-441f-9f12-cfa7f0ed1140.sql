-- Create a function to safely decrement stock quantity
CREATE OR REPLACE FUNCTION public.decrement_stock(product_name TEXT, quantity INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INTEGER;
    new_stock INTEGER;
BEGIN
    -- Get current stock
    SELECT stock_quantity INTO current_stock
    FROM products 
    WHERE name = product_name;
    
    -- Calculate new stock (don't go below 0)
    new_stock := GREATEST(current_stock - quantity, 0);
    
    -- Update the stock
    UPDATE products 
    SET stock_quantity = new_stock
    WHERE name = product_name;
    
    RETURN new_stock;
END;
$$;

-- Create a table to store coupon codes
CREATE TABLE IF NOT EXISTS public.coupon_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percentage DECIMAL(3,2) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Enable RLS on coupon_codes
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for coupon_codes
CREATE POLICY "Users can view their own coupons" 
ON public.coupon_codes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coupons" 
ON public.coupon_codes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coupons" 
ON public.coupon_codes 
FOR UPDATE 
USING (auth.uid() = user_id);