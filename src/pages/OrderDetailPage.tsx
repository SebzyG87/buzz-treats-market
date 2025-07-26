import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OrderDetailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link to="/order-history">
            <Button variant="outline">Back to Order History</Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Order details are now managed through your Ecwid account.
            </p>
            <a 
              href="https://my.ecwid.com/api/v3/121542775/customers/login" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button>View Order Details on Ecwid</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;