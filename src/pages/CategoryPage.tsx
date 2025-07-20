import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price_value: number;
  image_url: string;
  category: string;
  stock_quantity: number;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categoryTitles: { [key: string]: string } = {
    'gummies': 'Gummies',
    'chocolate-bars': 'Chocolate Bars',
    'cookies': 'Cookies',
    'e-liquids': 'E-liquids'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category.replace('-', ' '));

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const categoryTitle = categoryTitles[category || ''] || 'Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">{categoryTitle}</h1>
        <p className="text-muted-foreground text-lg">
          Discover our premium collection of {categoryTitle.toLowerCase()}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No products found</h2>
          <p className="text-muted-foreground">
            We're working on adding more {categoryTitle.toLowerCase()} to our collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;