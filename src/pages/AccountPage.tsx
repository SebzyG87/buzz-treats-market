import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, History, MapPin, Gift } from 'lucide-react';

interface UserProfile {
  full_name: string;
  loyalty_points: number;
}

interface CouponCode {
  code: string;
  used: boolean;
}

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, loyalty_points')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } else {
        setProfile(data);
        setNewFullName(data.full_name || '');
      }
      setProfileLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ full_name: newFullName })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setProfile(prev => prev ? { ...prev, full_name: newFullName } : null);
      setIsEditDialogOpen(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!user || !profile || profile.loyalty_points < 500) return;

    // Generate a unique coupon code
    const couponCode = `LEAF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Deduct 500 points
    const { error } = await supabase
      .from('user_profiles')
      .update({ loyalty_points: profile.loyalty_points - 500 })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to redeem points",
        variant: "destructive"
      });
    } else {
      setProfile(prev => prev ? { ...prev, loyalty_points: prev.loyalty_points - 500 } : null);
      setGeneratedCoupon(couponCode);
      toast({
        title: "Points Redeemed!",
        description: "Your 15% discount coupon has been generated"
      });
    }
  };

  const copyCouponCode = () => {
    if (generatedCoupon) {
      navigator.clipboard.writeText(generatedCoupon);
      toast({
        title: "Copied!",
        description: "Coupon code copied to clipboard"
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Update Profile</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg">{profile?.full_name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              🍃 Loyalty Leafs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary mb-2">
                {profile?.loyalty_points || 0}
              </div>
              <p className="text-muted-foreground">
                Earn 1 Loyalty Leaf for every £1 spent
              </p>
              {profile && profile.loyalty_points >= 500 && (
                <Button onClick={handleRedeemPoints} className="mt-4">
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem 500 Points (15% Off)
                </Button>
              )}
              {profile && profile.loyalty_points < 500 && (
                <p className="text-sm text-muted-foreground">
                  Collect {500 - profile.loyalty_points} more points to unlock a 15% discount
                </p>
              )}
            </div>
            
            {generatedCoupon && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Your 15% Discount Code:</h4>
                <div className="flex items-center space-x-2">
                  <code className="bg-white px-3 py-2 rounded border text-lg font-mono">
                    {generatedCoupon}
                  </code>
                  <Button size="sm" onClick={copyCouponCode}>
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Use this code at checkout to get 15% off your order!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/order-history">
              <Button variant="outline" className="w-full justify-start">
                <History className="w-4 h-4 mr-2" />
                View Order History
              </Button>
            </Link>
            <Link to="/manage-addresses">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Manage Addresses
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" onClick={signOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">£0.00</div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;