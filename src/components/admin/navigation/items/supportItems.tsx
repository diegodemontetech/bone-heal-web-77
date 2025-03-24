
import { MessageSquareText, MailOpen } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const supportItems: NavItem[] = [
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
];
