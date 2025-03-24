
import { Truck, DollarSign, Settings } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const logisticsItems: NavItem[] = [
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
];
