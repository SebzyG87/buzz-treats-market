import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const ProductDetailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/shop" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Link>

      <Card>
        <CardContent className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Product Details</h1>
          <p className="text-muted-foreground mb-6">
            Product details and purchasing are now handled through our Ecwid store.
          </p>
          <Link to="/shop">
            <Button>View Products</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;