import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Square: any;
  }
}

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: user?.email || '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom'
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price_value * item.quantity), 0);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const total = subtotal - discountAmount;

  useEffect(() => {
    const initializeSquare = async () => {
      if (!window.Square) {
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => {
          if (window.Square) {
            initSquarePayments();
          }
        };
        document.head.appendChild(script);
      } else {
        initSquarePayments();
      }
    };

    const initSquarePayments = async () => {
      try {
        const paymentsInstance = window.Square.payments('sandbox-sq0idb-APPLICATION_ID', 'LOCATION_ID');
        setPayments(paymentsInstance);
        
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } catch (error) {
        console.error('Failed to initialize Square payments:', error);
      }
    };

    initializeSquare();
  }, []);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleApplyPromoCode = async () => {
    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('code', promoCode)
        .eq('used', false)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Promo Code",
          description: "Please check your promo code and try again",
          variant: "destructive"
        });
        return;
      }

      setAppliedDiscount(data.discount_percentage);
      toast({
        title: "Promo Code Applied!",
        description: `You've received a ${Math.round(data.discount_percentage * 100)}% discount`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply promo code",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) {
      toast({
        title: "Payment Error",
        description: "Payment form not ready. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        const { data, error } = await supabase.functions.invoke('process-square-payment', {
          body: {
            sourceId: result.token,
            amount: Math.round(total * 100), // Convert to pence
            items: items.map(item => ({
              name: item.product.name,
              price: item.product.price_value,
              quantity: item.quantity
            })),
            shippingAddress: shippingInfo,
            user_id: user?.id || null,
            guest_email: user ? null : shippingInfo.email,
            discount_percentage: appliedDiscount,
            promo_code: promoCode || null
          }
        });

        if (error) throw error;

        if (data.success) {
          clearCart();
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed successfully."
          });
          navigate('/payment-success');
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        throw new Error('Card tokenization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return shippingInfo.email && 
           shippingInfo.fullName && 
           shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.postcode;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={shippingInfo.postcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="card-container" className="min-h-[100px] p-4 border rounded-md"></div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          {/* Promo Code */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <Button type="button" variant="outline" onClick={handleApplyPromoCode}>
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>£{(item.product.price_value * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({Math.round(appliedDiscount * 100)}%)</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full" 
                size="lg"
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Processing...' : `Pay £${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;