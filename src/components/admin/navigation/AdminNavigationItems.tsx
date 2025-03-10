
import { Home, Package, ShoppingCart, Users, FileText, Settings, BarChart2, MessageSquare, Headphones, MessageCircle } from "lucide-react";
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
    permissions: [UserPermission.MANAGE_PRODUCTS],
    children: [
      {
        title: "Lista de Produtos",
        href: "/admin/products",
        permissions: [UserPermission.MANAGE_PRODUCTS]
      },
      {
        title: "Adicionar Produto",
        href: "/admin/products/add",
        permissions: [UserPermission.MANAGE_PRODUCTS]
      }
    ]
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
    permissions: [UserPermission.MANAGE_ORDERS],
    children: [
      {
        title: "Pedidos",
        href: "/admin/orders",
        permissions: [UserPermission.MANAGE_ORDERS]
      },
      {
        title: "Orçamentos",
        href: "/admin/quotations",
        permissions: [UserPermission.MANAGE_ORDERS]
      }
    ]
  },
  {
    title: "Clientes",
    href: "/admin/users",
    icon: Users,
    permissions: [UserPermission.MANAGE_CUSTOMERS],
    children: [
      {
        title: "Usuários",
        href: "/admin/users",
        permissions: [UserPermission.MANAGE_USERS]
      }
    ]
  },
  {
    title: "CRM",
    href: "/admin/leads",
    icon: BarChart2,
    permissions: [UserPermission.MANAGE_CUSTOMERS],
    children: [
      {
        title: "Leads",
        href: "/admin/leads",
        permissions: [UserPermission.MANAGE_CUSTOMERS]
      },
      {
        title: "Kanban de Leads",
        href: "/admin/leads/kanban",
        permissions: [UserPermission.MANAGE_CUSTOMERS]
      }
    ]
  },
  {
    title: "Suporte",
    href: "/admin/tickets",
    icon: Headphones,
    permissions: [UserPermission.MANAGE_SUPPORT],
    children: [
      {
        title: "Tickets",
        href: "/admin/tickets",
        permissions: [UserPermission.MANAGE_SUPPORT]
      }
    ]
  },
  {
    title: "WhatsApp",
    href: "/admin/whatsapp/messages",
    icon: MessageCircle,
    permissions: [UserPermission.MANAGE_SUPPORT],
    children: [
      {
        title: "Mensagens",
        href: "/admin/whatsapp/messages",
        permissions: [UserPermission.MANAGE_SUPPORT]
      },
      {
        title: "Configurações",
        href: "/admin/whatsapp/settings",
        permissions: [UserPermission.MANAGE_INTEGRATIONS]
      }
    ]
  },
  {
    title: "Conteúdo",
    href: "/admin/news",
    icon: FileText,
    permissions: [UserPermission.MANAGE_PRODUCTS],
    children: [
      {
        title: "Notícias",
        href: "/admin/news",
        permissions: [UserPermission.MANAGE_PRODUCTS]
      },
      {
        title: "Estudos Científicos",
        href: "/admin/studies",
        permissions: [UserPermission.MANAGE_PRODUCTS]
      }
    ]
  },
  {
    title: "Configurações",
    href: "/admin/shipping",
    icon: Settings,
    permissions: [UserPermission.MANAGE_SETTINGS],
    children: [
      {
        title: "Envio",
        href: "/admin/shipping",
        permissions: [UserPermission.MANAGE_SETTINGS]
      },
      {
        title: "Cupons",
        href: "/admin/vouchers",
        permissions: [UserPermission.MANAGE_SETTINGS]
      },
      {
        title: "Condições Comerciais",
        href: "/admin/commercial-conditions",
        permissions: [UserPermission.MANAGE_SETTINGS]
      },
      {
        title: "Templates de Email",
        href: "/admin/email-templates",
        permissions: [UserPermission.MANAGE_SETTINGS]
      },
      {
        title: "Segurança",
        href: "/admin/security",
        permissions: [UserPermission.MANAGE_USERS]
      },
      {
        title: "Sincronização",
        href: "/admin/sync",
        permissions: [UserPermission.MANAGE_INTEGRATIONS]
      }
    ]
  }
];
