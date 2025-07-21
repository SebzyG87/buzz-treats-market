import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ImageCarousel from '@/components/ImageCarousel';

const categories = [
  {
    id: 'gummies',
    title: 'Gummies',
    images: [
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/1000mg-5-sweets.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/1000mg-2-sweets.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/250mg-3-sweets.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/250mg-5-sweets.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/500mg-3-sweets.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/gummies/500mg-5-sweets.jpg'
    ],
    description: 'Chewy, fruity delights in every bite'
  },
  {
    id: 'chocolate-bars',
    title: 'Chocolate Bars', 
    images: [
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/chocolate-bars/500mg-chocolate-bar.jpg',
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop'
    ],
    description: 'Rich, creamy chocolate experiences'
  },
  {
    id: 'cookies',
    title: 'Cookies',
    images: [
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/cookies/standard-cookie.jpg',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'
    ],
    description: 'Freshly baked goodness awaits'
  },
  {
    id: 'e-liquids',
    title: 'E-liquids',
    images: [
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/1e-liquids.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/2e-liquids.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/3e-liquids.jpg',
      'https://cyiyydakxqpygstaxqfw.supabase.co/storage/v1/object/public/product-images/4e-liquids.jpg'
    ],
    description: 'Premium vaping flavors and blends'
  }
];

const Home = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Buzzing Treats</h1>
          <p className="text-xl mb-8 opacity-90">
            Discover our premium collection of sweet treats and e-liquids
          </p>
          <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Explore Our Products
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Shop by Category
          </h2>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Link key={category.id} to={`/${category.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <ImageCarousel 
                        images={category.images}
                        className="w-full h-64"
                        autoPlayInterval={4000}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                        <p className="text-sm opacity-90 mb-4">{category.description}</p>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders over £50</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍃</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Loyalty Leafs</h3>
              <p className="text-muted-foreground">Earn points with every purchase</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Only the finest ingredients</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
