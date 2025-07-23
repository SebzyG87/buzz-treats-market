import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReturnsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Returns & Refunds</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Return Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Items must be unopened and in original packaging</li>
              <li>Perishable items cannot be returned for hygiene reasons</li>
              <li>Custom orders are non-returnable</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Return</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Contact our customer service team</li>
              <li>Package items securely in original packaging</li>
              <li>Include your order number</li>
              <li>Send to our returns address</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnsPage;