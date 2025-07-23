import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShippingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>UK Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Standard Delivery (2-3 business days):</strong> £4.99</p>
              <p><strong>Express Delivery (1-2 business days):</strong> £9.99</p>
              <p><strong>Free Shipping:</strong> On orders over £50</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>International Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Europe:</strong> £12.99 (5-7 business days)</p>
              <p><strong>Rest of World:</strong> £19.99 (7-14 business days)</p>
              <p className="text-sm text-muted-foreground">
                * Additional customs fees may apply for international orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingPage;