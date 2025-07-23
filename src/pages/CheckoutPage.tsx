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
  const [isGuestCheckout, setIsGuestCheckout] = useState(!user);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price_value * item.quantity), 0);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const shippingCost = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal - discountAmount + shippingCost;

  const countries = [
    'United Kingdom',
    'United States', 
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Belgium',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Ireland'
  ];

  useEffect(() => {
    const initializeSquare = async () => {
      setPaymentFormLoading(true);
      setPaymentFormError(null);
      
      try {
        console.log('Initializing Square payment form...');
        
        if (!window.Square) {
          console.log('Loading Square script...');
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = true;
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log('Square script loaded successfully');
              resolve();
            };
            script.onerror = () => {
              console.error('Failed to load Square script');
              reject(new Error('Failed to load Square script'));
            };
            document.head.appendChild(script);
          });
        }

        const applicationId = 'sandbox-sq0idb-5k0bXwu0zQTpJNdCJL8O_Q';
        const locationId = 'LMQ4F7MJP1WEQ';

        console.log('Using Square config:', { 
          applicationId: applicationId.substring(0, 20) + '...', 
          locationId,
          environment: 'sandbox'
        });

        if (!applicationId || !locationId) {
          throw new Error('Square credentials are not configured');
        }

        const payments = window.Square.payments(applicationId, locationId);
        console.log('Square payments instance created');
        
        const cardInstance = await payments.card({
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
        console.log('Square card instance created');
        
        await cardInstance.attach('#card-container');
        console.log('Square card attached to container');
        
        setCard(cardInstance);
        console.log('Square payment form initialized successfully');

      } catch (error: any) {
        console.error('Square initialization error:', error);
        setPaymentFormError(error.message || 'Failed to initialize payment form. Please try again.');
      } finally {
        setPaymentFormLoading(false);
      }
    };

    const timer = setTimeout(initializeSquare, 100);
    return () => clearTimeout(timer);
  }, []);

  const retryPaymentForm = () => {
    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
      cardContainer.innerHTML = '';
    }
    setCard(null);
    setPaymentFormError(null);
    
    const timer = setTimeout(() => {
      const initializeSquare = async () => {
        setPaymentFormLoading(true);
        try {
          const hostname = window.location.hostname;
          const isProduction = hostname !== 'localhost' && 
                             !hostname.includes('127.0.0.1') &&
                             !hostname.includes('.lovableproject.com') &&
                             !hostname.includes('.dev');

          const applicationId = isProduction ? 'sq0idp-tJWqTdSE9rrKxg8m2G0Pjw' : 'sandbox-sq0idb-5k0bXwu0zQTpJNdCJL8O_Q';
          const locationId = isProduction ? 'LQMJEPXV1BA5A' : 'LMQ4F7MJP1WEQ';

          const payments = window.Square.payments(applicationId, locationId);
          const cardInstance = await payments.card({
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
        } catch (error: any) {
          setPaymentFormError(error.message || 'Failed to initialize payment form. Please try again.');
        } finally {
          setPaymentFormLoading(false);
        }
      };
      initializeSquare();
    }, 100);
    return () => clearTimeout(timer);
  };

  // Redirect to cart if empty
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Show auth prompt if not logged in and not guest checkout
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
      country: value,
      postcode: '' // Clear postcode when country changes
    });
  };

  const isFormValid = () => {
    return shippingInfo.fullName.trim() !== '' &&
           shippingInfo.email.trim() !== '' &&
           shippingInfo.address.trim() !== '' &&
           shippingInfo.city.trim() !== '' &&
           shippingInfo.postcode.trim() !== '' &&
           shippingInfo.country.trim() !== '' &&
           card !== null;
  };

  const getPostcodeLabel = () => {
    return shippingInfo.country === 'United States' ? 'ZIP Code' : 'Postcode';
  };

  const getPostcodePlaceholder = () => {
    return shippingInfo.country === 'United States' ? '12345' : 'SW1A 1AA';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card) {
      toast({
        title: "Payment Error",
        description: "Payment form not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid()) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting payment process...');
      
      // Tokenize the card
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        console.log('Card tokenized successfully:', tokenResult.token);
        
        // Process payment through Supabase function
        const { data, error } = await supabase.functions.invoke('process-square-payment', {
          body: {
            sourceId: tokenResult.token,
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

        if (error) {
          console.error('Payment processing error:', error);
          throw new Error(error.message);
        }

        console.log('Payment processed successfully:', data);

        if (data.success) {
          // Clear cart and redirect to success page
          clearCart();
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed successfully.",
          });
          
          navigate('/payment-success');
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        console.error('Tokenization error:', tokenResult.errors);
        throw new Error(tokenResult.errors?.[0]?.detail || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                  disabled={!!user}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
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
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postcode">{getPostcodeLabel()} *</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={shippingInfo.postcode}
                    onChange={handleInputChange}
                    placeholder={getPostcodePlaceholder()}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
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
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleApplyPromoCode}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
              {appliedDiscount > 0 && (
                <div className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded">
                  ✓ Promo code applied! {Math.round(appliedDiscount * 100)}% discount
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">£{(item.product.price_value * item.quantity).toFixed(2)}</p>
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
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}</span>
                </div>
                
                {subtotal < 50 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over £50
                  </p>
                )}
                
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !isFormValid()}
              >
                {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Your payment information is secure and encrypted
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;