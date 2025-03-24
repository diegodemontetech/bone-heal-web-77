
import { Users } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const userItems: NavItem[] = [
  {
    title: "Usuários",
    icon: Users,
    href: "/admin/users",
    segment: "users",
    permission: "manage_users",
  },
];
