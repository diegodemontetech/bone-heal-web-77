import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  DollarSign,
  Calendar,
  PhoneCall,
  Star,
  Activity
} from "lucide-react";

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
  const [isChecking, setIsChecking] = useState(true);
  const [adminData, setAdminData] = useState<DashboardStats | null>(null);

  // Single check for admin status
  useEffect(() => {
    let isSubscribed = true;

    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!profile?.is_admin) {
          console.log("User is not admin, redirecting to home");
          navigate("/");
          return;
        }

        // Fetch dashboard data only if user is admin
        const [orders, leads, users] = await Promise.all([
          supabase.from("orders").select("*"),
          supabase.from("contact_leads").select("*"),
          supabase.from("profiles").select("*")
        ]);

        if (!isSubscribed) return;

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const recentLeads = leads.data?.filter(lead => 
          new Date(lead.created_at) > lastMonth
        ) || [];

        const pendingOrders = orders.data?.filter(order => 
          order.status === 'pending'
        ) || [];

        const totalRevenue = orders.data?.reduce((sum, order) => 
          sum + Number(order.total_amount), 0
        ) || 0;

        const stats: DashboardStats = {
          totalOrders: orders.data?.length || 0,
          totalRevenue,
          totalLeads: leads.data?.length || 0,
          averageOrderValue: orders.data?.length ? totalRevenue / orders.data.length : 0,
          leadConversionRate: orders.data?.length && leads.data?.length ? 
            (orders.data.length / leads.data.length) * 100 : 0,
          topProducts: [],
          leadsBySource: [
            { source: "WhatsApp", count: leads.data?.filter(l => l.source === "whatsapp_widget").length || 0 },
            { source: "Formulário", count: leads.data?.filter(l => l.source === "form").length || 0 }
          ],
          monthlyRevenue: [],
          stateData: [],
          recentLeadCount: recentLeads.length,
          pendingOrdersCount: pendingOrders.length,
          activeUsersCount: users.data?.length || 0
        };

        setAdminData(stats);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking admin access:", error);
        navigate("/admin/login");
      }
    };

    checkAdminAccess();

    return () => {
      isSubscribed = false;
    };
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminData) {
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
              <div className="text-2xl font-bold">R$ {adminData.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {adminData.totalOrders} pedidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Recentes</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.recentLeadCount}</div>
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
                {adminData.leadConversionRate.toFixed(1)}%
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
              <div className="text-2xl font-bold">{adminData.pendingOrdersCount}</div>
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
                R$ {adminData.averageOrderValue.toFixed(2)}
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
              <div className="text-2xl font-bold">{adminData.totalLeads}</div>
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
              <div className="text-2xl font-bold">{adminData.activeUsersCount}</div>
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
                {adminData.leadsBySource.find(s => s.source === "WhatsApp")?.count || 0}
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
