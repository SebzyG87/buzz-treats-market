import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🐝 Buzzing Treats
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/gummies" className="hover:text-accent transition-colors">
              Gummies
            </Link>
            <Link to="/chocolate-bars" className="hover:text-accent transition-colors">
              Chocolate Bars
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors">
              Cookies
            </Link>
            <Link to="/e-liquids" className="hover:text-accent transition-colors">
              E-liquids
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/account" className="hidden md:flex items-center hover:text-accent transition-colors">
                  <User className="w-5 h-5 mr-1" />
                  My Account
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="hidden md:block border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;