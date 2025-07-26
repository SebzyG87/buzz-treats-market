import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🐝 Buzzing Treats
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            <Link to="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-accent transition-colors">
              Shop
            </Link>
          </nav>

          {/* Search Box - Desktop */}
          <div className="hidden md:block">
            <div id="my-search-121542775"></div>
            <script 
              data-cfasync="false" 
              type="text/javascript" 
              src="https://app.ecwid.com/script.js?121542775&data_platform=code&data_date=2025-07-25" 
              charSet="utf-8"
            ></script>
            <script type="text/javascript">
              {`xSearch("id=my-search-121542775");`}
            </script>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
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
                    to="/shop" 
                    className="text-lg hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop
                  </Link>
                  
                  {/* Mobile Search */}
                  <div className="border-t pt-4 mt-4">
                    <div id="my-search-mobile-121542775"></div>
                    <script 
                      data-cfasync="false" 
                      type="text/javascript" 
                      src="https://app.ecwid.com/script.js?121542775&data_platform=code&data_date=2025-07-25" 
                      charSet="utf-8"
                    ></script>
                    <script type="text/javascript">
                      {`xSearch("id=my-search-mobile-121542775");`}
                    </script>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* My Account - External Link */}
            <a 
              href="https://my.ecwid.com/api/v3/121542775/customers/login" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:flex items-center hover:text-accent transition-colors text-sm"
            >
              My Account
            </a>

            {/* Shopping Bag */}
            <div className="ec-cart-widget"></div>
            <script 
              data-cfasync="false" 
              type="text/javascript" 
              src="https://app.ecwid.com/script.js?121542775&data_platform=code&data_date=2025-07-25" 
              charSet="utf-8"
            ></script>
            <script type="text/javascript">
              {`Ecwid.init();`}
            </script>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;