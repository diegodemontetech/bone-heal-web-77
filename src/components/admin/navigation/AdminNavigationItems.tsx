
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  Ticket, Tag, FileText, Megaphone, MessageSquare, 
  Mail, Truck, RefreshCcw, Shield, LifeBuoy 
} from "lucide-react";
import { UserPermission } from "@/types/auth";

export const adminNavigationItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    permission: null
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
    permission: UserPermission.MANAGE_USERS
  },
  {
    title: "Produtos",
    href: "/admin/products",
    icon: Package,
    permission: UserPermission.MANAGE_PRODUCTS
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: UserPermission.MANAGE_ORDERS
  },
  {
    title: "Cupons",
    href: "/admin/vouchers",
    icon: Tag,
    permission: UserPermission.MANAGE_PRODUCTS
  },
  {
    title: "Notícias",
    href: "/admin/news",
    icon: FileText,
    permission: null
  },
  {
    title: "Estudos",
    href: "/admin/studies",
    icon: Megaphone,
    permission: null
  },
  {
    title: "Leads",
    href: "/admin/leads",
    icon: Users,
    permission: UserPermission.MANAGE_CUSTOMERS
  },
  {
    title: "WhatsApp",
    href: "/admin/whatsapp",
    icon: MessageSquare,
    permission: null
  },
  {
    title: "Templates de Email",
    href: "/admin/email-templates",
    icon: Mail,
    permission: null
  },
  {
    title: "Taxas de Envio",
    href: "/admin/shipping-rates",
    icon: Truck,
    permission: UserPermission.MANAGE_SETTINGS
  },
  {
    title: "Sincronização",
    href: "/admin/sync",
    icon: RefreshCcw,
    permission: UserPermission.MANAGE_INTEGRATIONS
  },
  {
    title: "Segurança",
    href: "/admin/security",
    icon: Shield,
    permission: UserPermission.MANAGE_SETTINGS
  },
  {
    title: "Tickets",
    href: "/admin/tickets",
    icon: LifeBuoy,
    permission: UserPermission.MANAGE_SUPPORT
  }
];
