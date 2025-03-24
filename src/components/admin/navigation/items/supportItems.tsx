
import { NavItem } from "@/components/admin/navigation/types";
import { MessageSquare, Mail } from "lucide-react";

export const supportItems: NavItem[] = [
  {
    title: "Suporte",
    href: "/admin/tickets",
    icon: MessageSquare,
    children: [
      {
        title: "Tickets",
        href: "/admin/tickets",
        icon: MessageSquare,
      },
      {
        title: "Formulários de Contato",
        href: "/admin/contacts",
        icon: Mail,
      }
    ]
  },
];
