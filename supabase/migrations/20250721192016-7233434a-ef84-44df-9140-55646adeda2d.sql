-- Add product variations support
CREATE TABLE public.product_variations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  weight TEXT NOT NULL, -- e.g., "250mg", "500mg", "1000mg"
  price_value NUMERIC NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Product variations are viewable by everyone" 
ON public.product_variations 
FOR SELECT 
USING (true);

-- Add index for better performance
CREATE INDEX idx_product_variations_product_id ON public.product_variations(product_id);