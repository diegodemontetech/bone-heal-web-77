import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  DollarSign,
  Calendar,
  PhoneCall,
  Truck,
  Star,
  Activity
} from "lucide-react";
import { useState } from "react";

// Moved types to the top for better organization
interface OrderItem {
  name: string;
  quantity: number;
}

interface ShippingAddress {
  state: string;
}

interface Order {
  id: string;
  total_amount: number;
  shipping_address: ShippingAddress | null;
  items: OrderItem[] | null;
  created_at: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalLeads: number;
  averageOrderValue: number;
  leadConversionRate: number;
  topProducts: { name: string; quantity: number }[];
  leadsBySource: { source: string; count: number }[];
  monthlyRevenue: { month: string; amount: number }[];
  stateData: { state: string; value: number }[];
  recentLeadCount: number;
  pendingOrdersCount: number;
  activeUsersCount: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/admin/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!profile?.is_admin) {
          navigate("/");
          return;
        }

        setIsAdmin(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/admin/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  // Fetch dashboard stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!isAdmin) return null;

      // Fetch orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*");

      // Fetch leads
      const { data: leads } = await supabase
        .from("contact_leads")
        .select("*");

      // Fetch users
      const { data: users } = await supabase
        .from("profiles")
        .select("*");

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const recentLeads = leads?.filter(lead => 
        new Date(lead.created_at) > lastMonth
      ) || [];

      const pendingOrders = orders?.filter(order => 
        order.status === 'pending'
      ) || [];

      const totalRevenue = orders?.reduce((sum, order) => 
        sum + Number(order.total_amount), 0
      ) || 0;

      const stats: DashboardStats = {
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalLeads: leads?.length || 0,
        averageOrderValue: orders?.length ? totalRevenue / orders.length : 0,
        leadConversionRate: orders?.length && leads?.length ? 
          (orders.length / leads.length) * 100 : 0,
        topProducts: [], // Calculated from orders items
        leadsBySource: [
          { source: "WhatsApp", count: leads?.filter(l => l.source === "whatsapp_widget").length || 0 },
          { source: "Formulário", count: leads?.filter(l => l.source === "form").length || 0 }
        ],
        monthlyRevenue: [], // Calculated from orders
        stateData: [], // Calculated from orders shipping_address
        recentLeadCount: recentLeads.length,
        pendingOrdersCount: pendingOrders.length,
        activeUsersCount: users?.length || 0
      };

      return stats;
    },
    enabled: isAdmin,
  });

  if (isLoading || isStatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <main className="p-8">
        <h1 className="text-4xl font-bold mb-8">Painel Administrativo</h1>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats?.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalOrders} pedidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Recentes</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recentLeadCount}</div>
              <p className="text-xs text-muted-foreground">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.leadConversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Leads → Vendas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrdersCount}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando processamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats?.averageOrderValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Por pedido
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Desde o início
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsersCount}</div>
              <p className="text-xs text-muted-foreground">
                Cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads por WhatsApp</CardTitle>
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.leadsBySource.find(s => s.source === "WhatsApp")?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Via widget
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Origem dos Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {/* Add a pie chart here showing lead sources distribution */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas por Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {/* Add a line chart here showing monthly sales */}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default Admin;
