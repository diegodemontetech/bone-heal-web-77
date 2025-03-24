
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LayoutDashboard,
  Newspaper,
  MessageSquareText,
  MailOpen,
  BookOpen,
  Kanban,
  Truck,
  BatteryCharging,
  UserCircle,
  Tags,
  DollarSign,
  Percent,
  ListChecks,
} from "lucide-react";

import { NavItem } from "@/components/admin/navigation/types";

export const adminNavigationItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    segment: null,
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/admin/users",
    segment: "users",
    permission: "manage_users",
  },
  {
    title: "Produtos",
    icon: Package,
    href: "/admin/products",
    segment: "products",
    permission: "manage_products",
    children: [
      {
        title: "Lista de Produtos",
        href: "/admin/products",
        segment: "products",
        icon: ListChecks,
      },
      {
        title: "Adicionar Produto",
        href: "/admin/products/new",
        segment: "new",
        icon: Package,
      },
      {
        title: "Categorias",
        href: "/admin/products/categories",
        segment: "categories",
        icon: Tags,
      },
    ],
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/orders",
    segment: "orders",
    permission: "manage_orders",
    children: [
      {
        title: "Todos os Pedidos",
        href: "/admin/orders",
        segment: "orders",
        icon: ShoppingCart,
      },
      {
        title: "Criar Pedido",
        href: "/admin/orders/new",
        segment: "new",
        icon: Package,
      },
      {
        title: "Orçamentos",
        href: "/admin/quotations",
        segment: "quotations",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Marketing",
    icon: BarChart3,
    href: "/admin/marketing",
    segment: "marketing",
    permission: "manage_marketing",
    children: [
      {
        title: "Estudos",
        href: "/admin/studies",
        segment: "studies",
        icon: BookOpen,
      },
      {
        title: "Notícias",
        href: "/admin/news",
        segment: "news",
        icon: Newspaper,
      },
      {
        title: "Automações",
        href: "/admin/automation",
        segment: "automation",
        icon: BatteryCharging,
      },
      {
        title: "Cupons",
        href: "/admin/vouchers",
        segment: "vouchers",
        icon: Tags,
      },
      {
        title: "Condições Comerciais",
        href: "/admin/commercial-conditions",
        segment: "commercial-conditions",
        icon: Percent,
      },
    ],
  },
  {
    title: "CRM",
    icon: UserCircle,
    href: "/admin/crm",
    segment: "crm",
    permission: "manage_customers",
    children: [
      {
        title: "Kanban",
        href: "/admin/crm/kanban",
        segment: "kanban",
        icon: Kanban,
      },
      {
        title: "Lista de Leads",
        href: "/admin/crm/leads",
        segment: "leads",
        icon: Users,
      },
      {
        title: "WhatsApp",
        href: "/admin/crm/whatsapp",
        segment: "whatsapp",
        icon: MessageSquareText,
      },
    ],
  },
  {
    title: "Suporte",
    icon: MessageSquareText,
    href: "/admin/tickets",
    segment: "tickets",
    permission: "manage_support",
  },
  {
    title: "Formulários de Contato",
    icon: MailOpen,
    href: "/admin/contacts",
    segment: "contacts",
    permission: "manage_support",
  },
  {
    title: "Logística",
    icon: Truck,
    href: "/admin/shipping",
    segment: "shipping",
    permission: "manage_settings",
    children: [
      {
        title: "Taxas de Envio",
        href: "/admin/shipping/rates",
        segment: "rates",
        icon: DollarSign,
      },
      {
        title: "Configurações",
        href: "/admin/shipping/settings",
        segment: "settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/admin/settings",
    segment: "settings",
    permission: "manage_settings",
    children: [
      {
        title: "Gerais",
        href: "/admin/settings/general",
        segment: "general",
        icon: Settings,
      },
      {
        title: "Notificações",
        href: "/admin/settings/notifications",
        segment: "notifications",
        icon: MailOpen,
      },
      {
        title: "Pagamentos",
        href: "/admin/settings/payments",
        segment: "payments",
        icon: DollarSign,
      },
      {
        title: "Integrações",
        href: "/admin/settings/integrations",
        segment: "integrations",
        icon: Truck,
      },
    ],
  },
];
