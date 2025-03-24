
import { Home, Package, ShoppingCart, Users, FileText, Settings, BarChart2, MessageSquare, MessageCircle, Zap, Truck, Tag, Beaker, BookOpen } from "lucide-react";
import { UserPermission } from "@/types/auth";

export const NavigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    permissions: []
  },
  {
    title: "Produtos",
    href: "/admin/products",
    icon: Package,
    permissions: [],
    children: [
      {
        title: "Lista de Produtos",
        href: "/admin/products",
        permissions: []
      },
      {
        title: "Adicionar Produto",
        href: "/admin/products/add",
        permissions: []
      }
    ]
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
    permissions: [],
    children: [
      {
        title: "Pedidos",
        href: "/admin/orders",
        permissions: []
      },
      {
        title: "Orçamentos",
        href: "/admin/quotations",
        permissions: []
      }
    ]
  },
  {
    title: "Clientes",
    href: "/admin/users",
    icon: Users,
    permissions: [],
    children: [
      {
        title: "Usuários",
        href: "/admin/users",
        permissions: []
      }
    ]
  },
  {
    title: "CRM",
    href: "/admin/crm",
    icon: BarChart2,
    permissions: [],
    children: [
      {
        title: "Hunting Ativo",
        href: "/admin/crm/hunting",
        permissions: []
      },
      {
        title: "Carteira de Clientes",
        href: "/admin/crm/carteira",
        permissions: []
      }
    ]
  },
  {
    title: "Suporte",
    href: "/admin/tickets",
    icon: MessageSquare,
    permissions: [],
    children: [
      {
        title: "Tickets",
        href: "/admin/tickets",
        permissions: []
      }
    ]
  },
  {
    title: "WhatsApp",
    href: "/admin/whatsapp/messages",
    icon: MessageCircle,
    permissions: [],
    children: [
      {
        title: "Mensagens",
        href: "/admin/whatsapp/messages",
        permissions: []
      },
      {
        title: "Configurações",
        href: "/admin/whatsapp/settings",
        permissions: []
      }
    ]
  },
  {
    title: "Automação",
    href: "/admin/automation/flows",
    icon: Zap,
    permissions: [],
    children: [
      {
        title: "Fluxos de Trabalho",
        href: "/admin/automation/flows",
        permissions: []
      }
    ]
  },
  {
    title: "Conteúdo",
    href: "/admin/news",
    icon: FileText,
    permissions: [],
    children: [
      {
        title: "Notícias",
        href: "/admin/news",
        permissions: []
      },
      {
        title: "Estudos Científicos",
        href: "/admin/studies",
        permissions: []
      }
    ]
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: Settings,
    permissions: [],
    children: [
      {
        title: "Envio",
        href: "/admin/shipping",
        permissions: []
      },
      {
        title: "Ajuste de Taxa de Frete",
        href: "/admin/shipping-rates",
        permissions: []
      },
      {
        title: "Cupons",
        href: "/admin/vouchers",
        permissions: []
      },
      {
        title: "Condições Comerciais",
        href: "/admin/commercial-conditions",
        permissions: []
      },
      {
        title: "Templates de Email",
        href: "/admin/email-templates",
        permissions: []
      },
      {
        title: "Segurança",
        href: "/admin/security",
        permissions: []
      },
      {
        title: "Sincronização",
        href: "/admin/sync",
        permissions: []
      },
      {
        title: "API Evolution",
        href: "/admin/api-evolution",
        permissions: []
      },
      {
        title: "n8n",
        href: "/admin/n8n",
        permissions: []
      }
    ]
  }
];
