import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Package, Heart } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Clear the cart on successful payment
      clearCart();
      
      // Fetch order details and update loyalty points if user is logged in
      const processOrder = async () => {
        if (user) {
          try {
            // Update loyalty points
            const { error: loyaltyError } = await supabase
              .rpc('increment_loyalty_points', {
                user_id_param: user.id,
                points_to_add: Math.floor(50) // This should be calculated from actual order total
              });

            if (loyaltyError) {
              console.error('Error updating loyalty points:', loyaltyError);
            }
          } catch (error) {
            console.error('Error processing order:', error);
          }
        }
        setLoading(false);
      };

      processOrder();
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart, user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Processing your order...</p>
      </div>
    );
  }

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
            <p className="text-sm text-muted-foreground mb-4">
              {sessionId && `Order ID: ${sessionId.slice(-8).toUpperCase()}`}
            </p>
            <p>
              A confirmation email has been sent to your email address with all the order details.
              You can also track your order from your account page.
            </p>
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-green-500" />
                Loyalty Leafs Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  🍃 +{Math.floor(50)} Leafs
                </div>
                <p className="text-muted-foreground">
                  Added to your account for this purchase
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
          <Link to="/account" className="flex-1">
            <Button variant="outline" className="w-full">
              View Account
            </Button>
          </Link>
          <Link to="/" className="flex-1">
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