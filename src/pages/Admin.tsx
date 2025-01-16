import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch orders data for charts
  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ["orderStats"],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select(`
          id,
          total_amount,
          shipping_address,
          items,
          created_at
        `);

      // Process orders data for charts
      const stateData = {};
      const productData = {};
      const monthlyData = [];

      orders?.forEach(order => {
        // State data
        const state = order.shipping_address?.state || 'N/A';
        stateData[state] = (stateData[state] || 0) + order.total_amount;

        // Product data
        const items = order.items || [];
        items.forEach(item => {
          productData[item.name] = (productData[item.name] || 0) + item.quantity;
        });

        // Monthly data
        const date = new Date(order.created_at);
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        const monthIndex = monthlyData.findIndex(d => d.month === monthYear);
        if (monthIndex === -1) {
          monthlyData.push({ month: monthYear, amount: order.total_amount });
        } else {
          monthlyData[monthIndex].amount += order.total_amount;
        }
      });

      return {
        stateData: Object.entries(stateData).map(([state, value]) => ({
          state,
          value: Number(value.toFixed(2)),
        })),
        productData: Object.entries(productData).map(([name, quantity]) => ({
          name,
          quantity,
        })),
        monthlyData: monthlyData.sort((a, b) => 
          new Date(a.month) - new Date(b.month)
        ),
      };
    },
    enabled: !!profile?.is_admin,
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    if (!profileLoading && profile && !profile.is_admin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa.",
        variant: "destructive",
      });
      navigate("/products");
    }
  }, [session, profile, profileLoading, navigate, toast]);

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <AdminLayout>
      <main className="p-8">
        <h1 className="text-4xl font-bold mb-8">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas por Estado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStats?.stateData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Valor Total (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas por Produto</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStats?.productData || []}
                      dataKey="quantity"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {orderStats?.productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Mensais</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={orderStats?.monthlyData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      name="Valor Total (R$)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default Admin;