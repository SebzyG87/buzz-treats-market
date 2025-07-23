import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [paymentFormLoading, setPaymentFormLoading] = useState(true);
  const [paymentFormError, setPaymentFormError] = useState<string | null>(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: user?.email || '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom'
  });
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price_value * item.quantity), 0);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const shippingCost = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal - discountAmount + shippingCost;

  // Country list for international shipping
  const countries = [
    'United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Ireland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Cyprus', 'Luxembourg', 'Iceland', 'Liechtenstein', 'Monaco', 'San Marino', 'Vatican City', 'Andorra', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'New Zealand', 'Brazil', 'Argentina', 'Chile', 'Mexico', 'South Africa', 'India', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Taiwan', 'Israel', 'Turkey', 'Russia', 'Ukraine', 'Belarus', 'Serbia', 'Montenegro', 'Bosnia and Herzegovina', 'North Macedonia', 'Albania', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia', 'China', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Pakistan', 'Afghanistan', 'Iran', 'Iraq', 'Kuwait', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Bahrain', 'Oman', 'Yemen', 'Jordan', 'Lebanon', 'Syria', 'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan', 'Ethiopia', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Cameroon', 'Equatorial Guinea', 'Gabon', 'São Tomé and Príncipe', 'Cape Verde', 'Guinea-Bissau', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Ghana', 'Togo', 'Benin', 'Burkina Faso', 'Mali', 'Senegal', 'Mauritania', 'Gambia', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Angola', 'Mozambique', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Djibouti', 'Eritrea', 'Somalia', 'Malawi', 'Swaziland', 'Lesotho'
  ];

  useEffect(() => {
    const initializeSquare = async () => {
      setPaymentFormLoading(true);
      setPaymentFormError(null);
      
      try {
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            setTimeout(() => reject(new Error('Square script load timeout')), 10000);
            document.head.appendChild(script);
          });
        }

        await initSquarePayments();
      } catch (error) {
        console.error('Failed to load Square script:', error);
        setPaymentFormError('Unable to load payment system. Please refresh the page and try again.');
        setPaymentFormLoading(false);
      }
    };

    const initSquarePayments = async () => {
      try {
        // Use sandbox for all development and preview environments
        const isProduction = window.location.hostname.includes('yourdomain.com'); // Only your actual production domain
        const isLovablePreview = window.location.hostname.includes('.lovableproject.com');
        
        console.log('Environment detection:', { 
          hostname: window.location.hostname, 
          isProduction, 
          isLovablePreview 
        });
        
        const applicationId = isProduction ? 'sq0idp-tJWqTdSE9rrKxg8m2G0Pjw' : 'sandbox-sq0idb-5k0bXwu0zQTpJNdCJL8O_Q';
        const locationId = isProduction ? 'LQMJEPXV1BA5A' : 'LMQ4F7MJP1WEQ';
        
        console.log('Initializing Square with environment:', { isProduction, applicationId, locationId });
        
        const paymentsInstance = window.Square.payments(applicationId, locationId);
        setPayments(paymentsInstance);
        
        const cardInstance = await paymentsInstance.card({
          style: {
            input: {
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              padding: '12px'
            },
            '.input-container': {
              borderRadius: '6px'
            },
            '.input-container.is-focus': {
              borderColor: 'hsl(var(--ring))'
            },
            '.input-container.is-error': {
              borderColor: 'hsl(var(--destructive))'
            },
            '.message-text': {
              color: 'hsl(var(--destructive))'
            }
          }
        });
        
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
        setPaymentFormLoading(false);
        
        console.log('Square payment form initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Square payments:', error);
        setPaymentFormError('Unable to load payment form. Please refresh the page and try again.');
        setPaymentFormLoading(false);
      }
    };

    initializeSquare();
  }, []);

  const retryPaymentForm = () => {
    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
      cardContainer.innerHTML = '';
    }
    setCard(null);
    setPayments(null);
    
    // Re-initialize Square
    const initSquarePayments = async () => {
      setPaymentFormLoading(true);
      setPaymentFormError(null);
      
      try {
        const isProduction = !window.location.hostname.includes('localhost') && 
                           !window.location.hostname.includes('127.0.0.1') &&
                           !window.location.hostname.includes('.dev');
        
        const applicationId = isProduction ? 'sq0idp-tJWqTdSE9rrKxg8m2G0Pjw' : 'sandbox-sq0idb-5k0bXwu0zQTpJNdCJL8O_Q';
        const locationId = isProduction ? 'LQMJEPXV1BA5A' : 'LMQ4F7MJP1WEQ';
        
        const paymentsInstance = window.Square.payments(applicationId, locationId);
        setPayments(paymentsInstance);
        
        const cardInstance = await paymentsInstance.card({
          style: {
            input: {
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              padding: '12px'
            }
          }
        });
        
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
        setPaymentFormLoading(false);
      } catch (error) {
        console.error('Failed to initialize Square payments:', error);
        setPaymentFormError('Unable to load payment form. Please refresh the page and try again.');
        setPaymentFormLoading(false);
      }
    };

    initSquarePayments();
  };

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // If not logged in and not in guest checkout mode, redirect to auth
  if (!user && !isGuestCheckout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Checkout Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Choose how you'd like to proceed:</p>
            <div className="space-y-2">
              <Link to="/auth" className="block">
                <Button className="w-full">Sign In to Your Account</Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsGuestCheckout(true)}
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

  const handleCountryChange = (value: string) => {
    setShippingInfo({
      ...shippingInfo,
      country: value
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
            guest_email: !user ? shippingInfo.email : null,
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
                  <Label htmlFor="postcode">
                    {shippingInfo.country === 'United States' ? 'ZIP Code' : 'Postcode'}
                  </Label>
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
                <Select value={shippingInfo.country} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentFormLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                  <div className="text-sm text-muted-foreground">Loading payment form...</div>
                </div>
              ) : paymentFormError ? (
                <div className="space-y-4 py-4">
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {paymentFormError}
                  </div>
                  <Button onClick={retryPaymentForm} variant="outline" size="sm">
                    Retry Payment Form
                  </Button>
                </div>
              ) : (
                <div id="card-container" className="min-h-[100px]"></div>
              )}
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
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}</span>
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
                {subtotal < 50 && (
                  <p className="text-sm text-muted-foreground">
                    Add £{(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
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