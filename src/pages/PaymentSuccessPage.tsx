import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';

const PaymentSuccessPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-foreground mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your order. We're preparing it for shipment.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              A confirmation email has been sent to your email address with all the order details.
              You can track your order from your Ecwid account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
              <p className="text-sm">We'll prepare your order within 24 hours</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
              <p className="text-sm">You'll receive a tracking number via email</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
              <p className="text-sm">Your treats will arrive in 2-5 business days</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="https://my.ecwid.com/api/v3/121542775/customers/login" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full">
              View Account
            </Button>
          </a>
          <Link to="/shop" className="flex-1">
            <Button className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;