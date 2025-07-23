import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const categories = [
    {
      name: 'Gummies',
      path: '/gummies',
      image: '/api/placeholder/300/300',
      description: 'Delicious gummy treats in various strengths'
    },
    {
      name: 'Chocolate Bars',
      path: '/chocolate-bars',
      image: '/api/placeholder/300/300',
      description: 'Rich chocolate bars with natural ingredients'
    },
    {
      name: 'Cookies',
      path: '/cookies',
      image: '/api/placeholder/300/300',
      description: 'Freshly baked cookies with special ingredients'
    },
    {
      name: 'E-liquids',
      path: '/e-liquids',
      image: '/api/placeholder/300/300',
      description: 'Premium e-liquids in various flavors'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to Buzzing Treats
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection of treats, from gummies to chocolate bars and everything in between.
          </p>
        </div>

        {/* 2x2 Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <Card className="h-full overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {category.name}
                      </h2>
                      <p className="text-sm md:text-base opacity-90">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Not sure what you're looking for?
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;