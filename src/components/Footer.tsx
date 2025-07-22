import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">🐝 Buzzing Treats</h3>
            <p className="text-sm opacity-90">
              Premium treats and e-liquids for your sweet tooth and vaping pleasure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gummies" className="hover:text-accent transition-colors">Gummies</Link></li>
              <li><Link to="/chocolate-bars" className="hover:text-accent transition-colors">Chocolate Bars</Link></li>
              <li><Link to="/cookies" className="hover:text-accent transition-colors">Cookies</Link></li>
              <li><Link to="/e-liquids" className="hover:text-accent transition-colors">E-liquids</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-accent transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              {!user && (
                <li><Link to="/auth" className="hover:text-accent transition-colors">Sign In</Link></li>
              )}
              <li><Link to="/account" className="hover:text-accent transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-accent transition-colors">Order History</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2024 Buzzing Treats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;