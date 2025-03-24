
import { UserCircle, Kanban, Users, MessageSquareText } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const crmItems: NavItem[] = [
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
];
