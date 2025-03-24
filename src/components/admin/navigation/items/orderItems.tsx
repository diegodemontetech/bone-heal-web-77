
import { ShoppingCart, Package, DollarSign } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const orderItems: NavItem[] = [
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
];
