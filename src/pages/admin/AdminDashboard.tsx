import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Package, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Fetch total customers
        const { count: customersCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch total revenue
        const { data: revenueData } = await supabase
          .from('orders')
          .select('total_amount');

        const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        setStats({
          totalOrders: ordersCount || 0,
          totalCustomers: customersCount || 0,
          totalProducts: productsCount || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a 
              href="/admin/products" 
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">Manage Products</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
            </a>
            <a 
              href="/admin/orders" 
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">Process Orders</h3>
              <p className="text-sm text-muted-foreground">View and manage customer orders</p>
            </a>
            <a 
              href="/admin/customers" 
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">Manage Customers</h3>
              <p className="text-sm text-muted-foreground">View customer profiles and loyalty points</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm font-medium">System operational</p>
                  <p className="text-xs text-muted-foreground">All services running normally</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium">Database connected</p>
                  <p className="text-xs text-muted-foreground">Supabase integration active</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-medium">Admin dashboard loaded</p>
                  <p className="text-xs text-muted-foreground">Ready for management</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;