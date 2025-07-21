import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price_value: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  sku: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive"
        });
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, toast]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock_quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive"
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price_value: product.price_value,
        image_url: product.image_url
      });
    }

    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart`
    });
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-muted rounded-lg h-96 animate-pulse" />
          <div className="space-y-4">
            <div className="bg-muted rounded h-8 animate-pulse" />
            <div className="bg-muted rounded h-6 animate-pulse" />
            <div className="bg-muted rounded h-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/${product.category.toLowerCase().replace(' ', '-')}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {product.category}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <img 
              src={product.image_url || '/placeholder.svg'} 
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-xl font-semibold text-primary mb-4">
              £{product.price_value.toFixed(2)}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.stock_quantity > 0 ? (
              <>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {product.stock_quantity} available
                </span>
              </>
            ) : (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* SKU */}
          {product.sku && (
            <p className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </p>
          )}

          {/* Quantity Selector */}
          {product.stock_quantity > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 border-l border-r min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
              >
                Add to Cart - £{(product.price_value * quantity).toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;