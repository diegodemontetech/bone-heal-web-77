
import { 
  Users, Package, ShoppingCart, 
  Settings, FileText, Bell, BarChart3,
  Tag, BookOpen, MessageSquare, RefreshCw,
  LogOut, Lock
} from "lucide-react";
import { UserPermission } from "@/types/auth";

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
  permission: UserPermission | null;
}

export const adminNavigationItems: NavigationItem[] = [
  {
    title: 'Painel',
    href: '/admin/dashboard',
    icon: BarChart3,
    permission: null
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users,
    permission: UserPermission.MANAGE_USERS
  },
  {
    title: 'Produtos',
    href: '/admin/products',
    icon: Package,
    permission: UserPermission.MANAGE_PRODUCTS
  },
  {
    title: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart,
    permission: UserPermission.MANAGE_ORDERS
  },
  {
    title: 'Vouchers',
    href: '/admin/vouchers',
    icon: Tag,
    permission: UserPermission.MANAGE_PRODUCTS
  },
  {
    title: 'Notícias',
    href: '/admin/news',
    icon: FileText,
    permission: null
  },
  {
    title: 'Estudos Científicos',
    href: '/admin/studies',
    icon: BookOpen,
    permission: null
  },
  {
    title: 'Leads',
    href: '/admin/leads',
    icon: Bell,
    permission: UserPermission.MANAGE_CUSTOMERS
  },
  {
    title: 'Mensagens',
    href: '/admin/whatsapp',
    icon: MessageSquare,
    permission: null
  },
  {
    title: 'Emails',
    href: '/admin/email-templates',
    icon: FileText,
    permission: null
  },
  {
    title: 'Fretes',
    href: '/admin/shipping-rates',
    icon: ShoppingCart,
    permission: UserPermission.MANAGE_SETTINGS
  },
  {
    title: 'Sincronização',
    href: '/admin/sync',
    icon: RefreshCw,
    permission: UserPermission.MANAGE_INTEGRATIONS
  },
  {
    title: 'Segurança',
    href: '/admin/security',
    icon: Lock,
    permission: UserPermission.MANAGE_SETTINGS
  },
  {
    title: 'Suporte',
    href: '/admin/tickets',
    icon: MessageSquare,
    permission: UserPermission.MANAGE_SUPPORT
  }
];
