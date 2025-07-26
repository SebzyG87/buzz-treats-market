import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string;
  price_value: number;
  original_price?: number;
  image_url: string;
  category: string;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  console.log('Product image URL:', product.image_url);

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={product.image_url || '/placeholder.svg'} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('Image failed to load:', product.image_url);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            {product.original_price && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Sale
              </Badge>
            )}
            {product.stock_quantity <= 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Low Stock
              </Badge>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">
                  £{product.price_value.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    £{product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            disabled={product.stock_quantity <= 0}
          >
            {product.stock_quantity <= 0 ? 'Out of Stock' : 'View Product'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;