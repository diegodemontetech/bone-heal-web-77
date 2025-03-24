
import { Settings, MailOpen, DollarSign, Truck } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const settingsItems: NavItem[] = [
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
