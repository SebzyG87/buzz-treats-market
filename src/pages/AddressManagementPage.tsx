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
import { Trash2, Plus } from 'lucide-react';

interface Address {
  id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postcode: string;
  country: string;
}

const AddressManagementPage = () => {
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      
      setAddressesLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load addresses",
          variant: "destructive"
        });
      } else {
        setAddresses(data || []);
      }
      setAddressesLoading(false);
    };

    if (user) {
      fetchAddresses();
    }
  }, [user, toast]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user.id,
        ...newAddress
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Address added successfully"
      });
      setIsDialogOpen(false);
      setNewAddress({
        address_line1: '',
        address_line2: '',
        city: '',
        postcode: '',
        country: 'United Kingdom'
      });
      // Refresh addresses
      const { data } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);
      setAddresses(data || []);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Address deleted successfully"
      });
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    }
  };

  if (loading || addressesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Addresses</h1>
          <Link to="/account">
            <Button variant="outline">Back to Account</Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new shipping address to your account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input
                    id="address_line1"
                    value={newAddress.address_line1}
                    onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address_line2"
                    value={newAddress.address_line2}
                    onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={newAddress.postcode}
                      onChange={(e) => setNewAddress({...newAddress, postcode: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Add Address</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
              <p className="text-sm text-muted-foreground">Add your first address to make checkout faster.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{address.address_line1}</p>
                      {address.address_line2 && <p className="text-muted-foreground">{address.address_line2}</p>}
                      <p className="text-muted-foreground">{address.city}, {address.postcode}</p>
                      <p className="text-muted-foreground">{address.country}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManagementPage;