
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useAdmin } from '@/hooks/useAdmin';

const Header = () => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { isAdmin } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🐝 Buzzing Treats
          </Link>

          {/* No desktop navigation - using hamburger menu for all screen sizes */}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu for All Screen Sizes */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link 
                    to="/" 
                    className="text-lg hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/" 
                    className="text-lg hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Sweets
                  </Link>
                  <Link 
                    to="/" 
                    className="text-lg hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sweet Tubs
                  </Link>
                  <Link 
                    to="/" 
                    className="text-lg hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    New Sweets
                  </Link>
                  
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="flex items-center text-lg hover:text-accent transition-colors mb-4"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Heart className="w-5 h-5 mr-2" />
                            Admin
                          </Link>
                        )}
                        <Link 
                          to="/account" 
                          className="flex items-center text-lg hover:text-accent transition-colors mb-4"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-5 h-5 mr-2" />
                          My Account
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* No desktop user actions - all in hamburger menu */}
            
            {/* Shopping Cart */}
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
